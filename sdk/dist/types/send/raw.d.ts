import { EventPayload, EventResponse } from "../types";
export declare function send(type: string, data: EventPayload): Promise<EventResponse>;
