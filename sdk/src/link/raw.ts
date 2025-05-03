import { EventPayload, LinkOptions } from "../types";
import { send } from "../send/raw";

export function link(
    element: HTMLElement,
    type: string,
    data: EventPayload,
    options: LinkOptions = {}
) {
    element.addEventListener("click", (event) => {
        if (options.preventDefault) {
            event.preventDefault();
        }
        send(type, data);
    });

    return element;
}
