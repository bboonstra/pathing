import { sendEvent } from "../core/api";
import { EventPayload, EventResponse } from "../types";

export function send(type: string, data: EventPayload): Promise<EventResponse> {
    return sendEvent(type, data);
}
