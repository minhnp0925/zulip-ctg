import json
import re
from typing import Any
import uuid

from zerver.lib.message import SendMessageRequest
from zerver.models import Message, SubMessage

# Minh: implementing call widget

def get_widget_data(content: str) -> tuple[str | None, Any]:
    valid_widget_types = ["poll", "todo", "call"] # Minh: adding "call" to supported widget types
    tokens = re.split(r"\s+|\n+", content)

    # tokens[0] will always exist
    if tokens[0].startswith("/"):
        widget_type = tokens[0].removeprefix("/")
        if widget_type in valid_widget_types:
            remaining_content = content.replace(tokens[0], "", 1)
            extra_data = get_extra_data_from_widget_type(remaining_content, widget_type)
            return widget_type, extra_data

    return None, None


def parse_poll_extra_data(content: str) -> Any:
    # This is used to extract the question from the poll command.
    # The command '/poll question' will pre-set the question in the poll
    lines = content.splitlines()
    question = ""
    options = []
    if lines and lines[0]:
        question = lines.pop(0).strip()
    for line in lines:
        # If someone is using the list syntax, we remove it
        # before adding an option.
        option = re.sub(r"(\s*[-*]?\s*)", "", line.strip(), count=1)
        if len(option) > 0:
            options.append(option)
    extra_data = {
        "question": question,
        "options": options,
    }
    return extra_data


# Minh: parse call data, for now just parse everything as room id
def parse_call_extra_data(content: str) -> Any:
    content = content.strip()
    try:
        data = json.loads(content)
        print("Call data:", data)
        room_name = data.get("room_name", "New meeting")
        audio_only = data.get("audio_only", False)
    except json.JSONDecodeError:
        room_name = "New meeting"
        audio_only = False

    room_id = str(uuid.uuid4())

    print("Room id:", room_id)

    extra_data = {
        "room_id": room_id,
        "room_name": room_name,
        "audio_only": audio_only,
    }
    return extra_data

def parse_todo_extra_data(content: str) -> Any:
    # This is used to extract the task list title from the todo command.
    # The command '/todo Title' will pre-set the task list title
    lines = content.splitlines()
    task_list_title = ""
    if lines and lines[0]:
        task_list_title = lines.pop(0).strip()
    tasks = []
    for line in lines:
        # If someone is using the list syntax, we remove it
        # before adding a task.
        task_data = re.sub(r"(\s*[-*]?\s*)", "", line.strip(), count=1)
        if len(task_data) > 0:
            # a task and its description (optional) are separated
            # by the (first) `: ` substring
            task_data_array = task_data.split(": ", 1)
            tasks.append(
                {
                    "task": task_data_array[0].strip(),
                    "desc": task_data_array[1].strip() if len(task_data_array) > 1 else "",
                }
            )
    extra_data = {
        "task_list_title": task_list_title,
        "tasks": tasks,
    }
    return extra_data


def get_extra_data_from_widget_type(content: str, widget_type: str | None) -> Any:
    if widget_type == "poll":
        return parse_poll_extra_data(content)
    elif widget_type == "todo":
        return parse_todo_extra_data(content)
    # Minh: fn call to parse room id
    else:
        return parse_call_extra_data(content)

def do_widget_post_save_actions(send_request: SendMessageRequest) -> None:
    """
    This code works with the web app; mobile and other
    clients should also start supporting this soon.
    """
    message_content = send_request.message.content
    sender_id = send_request.message.sender_id
    message_id = send_request.message.id

    widget_type = None
    extra_data = None

    widget_type, extra_data = get_widget_data(message_content)
    widget_content = send_request.widget_content
    if widget_content is not None:
        # Note that we validate this data in check_message,
        # so we can trust it here.
        widget_type = widget_content["widget_type"]
        extra_data = widget_content["extra_data"]

    if widget_type:
        content = dict(
            widget_type=widget_type,
            extra_data=extra_data,
        )
        submessage = SubMessage(
            sender_id=sender_id,
            message_id=message_id,
            msg_type="widget",
            content=json.dumps(content),
        )
        submessage.save()
        send_request.submessages = SubMessage.get_raw_db_rows([message_id])


def get_widget_type(*, message_id: int) -> str | None:
    submessage = (
        SubMessage.objects.filter(
            message_id=message_id,
            msg_type="widget",
        )
        .only("content")
        .first()
    )

    if submessage is None:
        return None

    try:
        data = json.loads(submessage.content)
    except Exception:
        return None

    try:
        return data["widget_type"]
    except Exception:
        return None


def is_widget_message(message: Message) -> bool:
    # Right now all messages that are widgetized use submessage, and vice versa.
    return message.submessage_set.exists()
