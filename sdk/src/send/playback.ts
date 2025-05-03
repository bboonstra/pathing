import { sendEvent } from "../core/api";
import { EventResponse, PlaybackData } from "../types";
import { Parameter } from "../core/parameter";

export function playback(data: PlaybackData): Promise<EventResponse> {
    // Transform required fields into Parameters
    const payload: Record<string, Parameter | unknown> = {
        contentId: new Parameter("Content ID", "content_id", data.contentId),
        timestamp: new Parameter("Timestamp", "timestamp", data.timestamp),
    };

    // Add optional fields
    if (data.duration !== undefined) {
        payload["duration"] = new Parameter(
            "Duration",
            "duration",
            data.duration
        );
    }

    if (data.title !== undefined) {
        payload["title"] = new Parameter("Title", "title", data.title);
    }

    // Add any extra payload data
    if (data.extra) {
        Object.entries(data.extra).forEach(([key, value]) => {
            payload[key] = value;
        });
    }

    return sendEvent("playback", payload);
}
