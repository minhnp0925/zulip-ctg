import $ from "jquery";

import render_widgets_call_widget from "../templates/widgets/call_widget.hbs";

import * as blueslip from "./blueslip"
import * as compose_call from "./compose_call";
import type {Message} from "./message_store";
import * as people from "./people"

declare class JitsiMeetExternalAPI {
    constructor(domain: string, options: {
        parentNode: HTMLElement;
        roomName: string;
        width?: string | number;
        height?: string | number;
        userInfo?: {
            displayName?: string;
            avatarURL?: string;
            email?: string;
        };
        jwt?: string; // Optional JWT token
        onload?: () => void; // Optional IFrame onload event handler
        invitees?: {
            email: string;
            name: string;
        }[]; // Array of participant info
        devices?: {
            audioInput?: string;
            audioOutput?: string;
            videoInput?: string;
        }; // Devices map
        lang?: string; // Default meeting language
        iceServers?: {
            urls: string | string[];
            username?: string;
            credential?: string;
        }[]; // Experimental ice server config
        configOverwrite?: Record<string, unknown>;
        interfaceConfigOverwrite?: Record<string, unknown>;
    });

    // Define other methods and events as needed
    addEventListener(event: string, handler: (eventData: unknown) => void): void;
    executeCommand(command: string, ...args: unknown[]): void;
}



export type CallWidgetExtraData = {
    room_id?: string | undefined
    room_name?: string | undefined;
    audio_only?: boolean | undefined;
};

export type CallWidgetOutboundData = {
    type: "call";
    room_id?: string | undefined
    room_name?: string | undefined;
    audio_only?: boolean | undefined;
};

export function activate({
    $elem,
    extra_data: {room_id = "", room_name = "", audio_only = false} = {},
    message,
}: {
    $elem: JQuery;
    extra_data: CallWidgetExtraData;
    message: Message;
}): (events: unknown[]) => void {

    // console.log(room_id, room_name, audio_only)
    const call_url = compose_call.get_jitsi_server_url() + "/" + room_id;
    function loadJitsiApi(callback: () => void): void {
        // if (typeof JitsiMeetExternalAPI !== "undefined") {
        //     callback();
        //     return;
        // }
    
        const script = document.createElement("script");
        script.src = compose_call.get_jitsi_server_url() + "/external_api.js";
        script.addEventListener('load', callback);

        script.addEventListener("error", () => {
            blueslip.error("Failed to load Jitsi external API script. Please check if the Jitsi server is reachable.");
        });

        document.head.append(script);
    }

    function initialize_iframe(): void {
        const $iframe_container = $elem.find(".call-iframe-container");
        $iframe_container.empty(); // Clear any previous iframe content

        const $iframe_parent = $("<div>").attr("id", `jitsi-meeting-${message.id}`);
        $iframe_container.append($iframe_parent);

        const parentNode = $iframe_parent[0]; // This extracts the native DOM element.

        if (!parentNode) {
            blueslip.error("Failed to find the parent node for Jitsi iframe");
            return;
        }

        loadJitsiApi(() => {
            const options = {
                parentNode,
                roomName: room_id,
                width: "100%",
                height: 500,
                userInfo: {
                    displayName: people.my_full_name(),
                },
                configOverwrite: {
                    subject: room_name,
                    startWithVideoMuted: audio_only,
                },
            };
            
            const rawUrl = compose_call.get_jitsi_server_url();
            if (!rawUrl) {
                blueslip.error("Jitsi server URL is not defined");
                return;
            }
            const url = rawUrl.replace(/^https?:\/\//, "");
            const meetAPI = new JitsiMeetExternalAPI(url, options);
            // console.log("meetAPI: " + JSON.stringify(meetAPI))
            
            if (meetAPI === undefined) {
                blueslip.error("Failed to initialize Jitsi Meet iframe:");
            }
        });

        $iframe_container.show(); // Make the iframe visible
    }

    function build_widget(): void {
        const html = render_widgets_call_widget({
            sender_name: message.sender_full_name,
            call_url,
            room_name,
        });
        $elem.html(html);

        // Handle "Join now" button click
        $elem.find(".call-join-button").on("click", (e) => {
            e.stopPropagation();
            initialize_iframe();
        });
    }

    function handle_events(_events: unknown[]): void {
        // This widget doesn't process any external events for now

    }

    build_widget();
    return handle_events;
}