import { sendEvent } from "../core/api";
import { EventResponse, ButtonData } from "../types";
import { Parameter } from "../core/parameter";

export function button(data: ButtonData): Promise<EventResponse> {
    // Transform required fields into Parameters
    const payload: Record<string, Parameter | unknown> = {
        buttonId: new Parameter("Button ID", "button_id", data.buttonId),
        location: new Parameter("Location", "location", data.location),
        action: new Parameter("Action", "action", data.action),
    };

    // Add optional fields
    if (data.buttonText !== undefined) {
        payload["buttonText"] = new Parameter(
            "Button Text",
            "button_text",
            data.buttonText
        );
    }

    // Add any extra payload data
    if (data.extra) {
        Object.entries(data.extra).forEach(([key, value]) => {
            payload[key] = value;
        });
    }

    return sendEvent("button", payload);
}
