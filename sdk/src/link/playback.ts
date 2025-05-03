import { PlaybackData, LinkOptions } from "../types";
import { playback as sendPlayback } from "../send/playback";

export function playback(
    element: HTMLElement,
    data: PlaybackData,
    options: LinkOptions = {}
) {
    element.addEventListener("click", (event) => {
        if (options.preventDefault) {
            event.preventDefault();
        }
        sendPlayback(data);
    });

    return element;
}
