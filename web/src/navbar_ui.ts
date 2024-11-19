import $ from "jquery";

import {realm} from "./state_data";

export function update_user_panel_button_display(): void {
    const show_user_panel_button = !realm.realm_hide_user_panel_button;
    $("#userlist-toggle").toggle(show_user_panel_button)
}