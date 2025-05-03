/* eslint-disable @typescript-eslint/no-explicit-any */

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

// Required fields for purchase events
export interface PurchaseData {
    product: string;
    price: number;
    currency: string;
    quantity?: number;
    extra?: EventPayload;
}

// Required fields for playback events
export interface PlaybackData {
    contentId: string;
    timestamp: number;
    duration?: number;
    title?: string;
    extra?: EventPayload;
}

// Required fields for button events
export interface ButtonData {
    buttonId: string;
    buttonText?: string;
    location: string; // e.g., "header", "footer", "sidebar"
    action: string; // what action the button performs
    extra?: EventPayload;
}

// Event map for typed events
export interface EventMap {
    purchase: (data: PurchaseData) => Promise<EventResponse>;
    pageview: (data: EventPayload) => Promise<EventResponse>;
    playback: (data: PlaybackData) => Promise<EventResponse>;
    button: (data: ButtonData) => Promise<EventResponse>;
    // Add other predefined events here
}
