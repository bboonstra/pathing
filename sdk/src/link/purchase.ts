import { PurchaseData, LinkOptions } from "../types";
import { purchase as sendPurchase } from "../send/purchase";

export function purchase(
    element: HTMLElement,
    data: PurchaseData,
    options: LinkOptions = {}
) {
    element.addEventListener("click", (event) => {
        if (options.preventDefault) {
            event.preventDefault();
        }
        sendPurchase(data);
    });

    return element;
}
