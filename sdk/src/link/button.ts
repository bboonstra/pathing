import { ButtonData, LinkOptions } from "../types";
import { button as sendButton } from "../send/button";

export function button(
    element: HTMLElement,
    data: ButtonData,
    options: LinkOptions = {}
) {
    element.addEventListener("click", (event) => {
        if (options.preventDefault) {
            event.preventDefault();
        }

        // If buttonText wasn't provided, get it from the element
        if (!data.buttonText && element.textContent) {
            data = {
                ...data,
                buttonText: element.textContent.trim(),
            };
        }

        // If buttonId wasn't provided, try to get it from the element
        if (!data.buttonId && element.id) {
            data = {
                ...data,
                buttonId: element.id,
            };
        } else if (!data.buttonId) {
            // Generate a simple identifier if no ID is available
            data = {
                ...data,
                buttonId: `btn-${element.tagName.toLowerCase()}-${Date.now()}`,
            };
        }

        sendButton(data);
    });

    return element;
}
