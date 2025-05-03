export interface EventPayload {
    [key: string]: any;
}
export interface EventResponse {
    success: boolean;
    error?: string;
    [key: string]: any;
}
export interface EventMetadata {
    [key: string]: {
        label: string;
        key: string;
    };
}
export interface EventData {
    type: string;
    payload: EventPayload;
    metadata?: EventMetadata;
}
export interface LinkOptions {
    preventDefault?: boolean;
}
export interface PurchaseData {
    product: string;
    price: number;
    currency: string;
    quantity?: number;
    extra?: EventPayload;
}
export interface PlaybackData {
    contentId: string;
    timestamp: number;
    duration?: number;
    title?: string;
    extra?: EventPayload;
}
export interface ButtonData {
    buttonId: string;
    buttonText?: string;
    location: string;
    action: string;
    extra?: EventPayload;
}
export interface EventMap {
    purchase: (data: PurchaseData) => Promise<EventResponse>;
    pageview: (data: EventPayload) => Promise<EventResponse>;
    playback: (data: PlaybackData) => Promise<EventResponse>;
    button: (data: ButtonData) => Promise<EventResponse>;
}
