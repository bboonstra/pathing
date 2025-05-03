import { sendEvent } from "../core/api";
import { EventResponse, PurchaseData } from "../types";
import { Parameter } from "../core/parameter";

export function purchase(data: PurchaseData): Promise<EventResponse> {
    // Transform required fields into Parameters
    const payload: Record<string, Parameter | unknown> = {
        product: new Parameter("Product", "product", data.product),
        price: new Parameter("Price", "price", data.price),
        currency: new Parameter("Currency", "currency", data.currency),
    };

    // Add optional fields
    if (data.quantity !== undefined) {
        payload["quantity"] = new Parameter(
            "Quantity",
            "quantity",
            data.quantity
        );
    }

    // Add any extra payload data
    if (data.extra) {
        Object.entries(data.extra).forEach(([key, value]) => {
            payload[key] = value;
        });
    }

    return sendEvent("purchase", payload);
}
