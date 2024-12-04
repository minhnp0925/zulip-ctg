import $ from "jquery";

import {realm} from "./state_data.ts";

// # Minh: function to hide sidebar UI on setting event fired
export function update_user_panel_button_display(): void {
    const show_user_panel_button = !realm.realm_hide_user_panel_button;
    $("#userlist-toggle").toggle(show_user_panel_button);
    $(".app-main .column-right").toggle(show_user_panel_button);
}