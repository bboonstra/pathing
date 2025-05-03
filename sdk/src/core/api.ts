/* eslint-disable @typescript-eslint/no-explicit-any */
import { config } from "./config";
import { Parameter } from "./parameter";
import { DeviceInfo } from "./device-info";

export async function sendEvent(type: string, payload: Record<string, any>) {
    if (!config.publicKey) {
        console.error(
            "Pathing: No API key available for tracking events. " +
                "If you're using the npm package, please initialize with your API key: " +
                "pathing.init('your-api-key'). " +
                'If running via script tag, make sure to include pathing-api-key="pk_[YOUR_API_KEY]" in your script tag.'
        );
        return { success: false, error: "No API key provided" };
    }

    if (config.verificationError) {
        console.warn("Pathing: Domain not verified. Tracking disabled.");
        return {
            success: false,
            error: "Domain not verified. Please verify your domain ownership.",
        };
    }

    // Get device and browser information
    const deviceInfo = await DeviceInfo.getAllInfo();

    // The server-side will capture the IP from the request

    const body = {
        type,
        payload: Parameter.unwrap(payload),
        metadata: Parameter.metadata(payload),
        deviceInfo, // Add device info to every event
        sessionInfo: {
            sessionId: getOrCreateSessionId(),
            visitCount: incrementVisitCount(),
            lastSeenAt: getLastSeenTime(),
            firstSeenAt: getFirstSeenTime(),
            referrer: document.referrer || null,
            entryPage: getEntryPage(),
        },
    };

    try {
        const res = await fetch("https://www.pathing.cc/api/collect", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Pathing-API-Key": config.publicKey,
            },
            body: JSON.stringify(body),
            mode: "no-cors",
        });

        const data = await res.json();

        if (!data.success && data.error?.includes("not verified")) {
            config.verificationError = true;
            console.warn("Pathing: " + data.error);
        }

        // Update last seen time
        setLastSeenTime();

        return data;
    } catch (error) {
        console.error("Pathing: Error tracking event", error);
        return { success: false, error: "Failed to track event" };
    }
}

// Session and user identification helpers
function getOrCreateSessionId(): string {
    const storageKey = "pathing_session_id";
    let sessionId = sessionStorage.getItem(storageKey);

    if (!sessionId) {
        // Generate a random session ID using current timestamp and a random number
        sessionId = `${Date.now()}-${Math.random()
            .toString(36)
            .substring(2, 15)}`;
        sessionStorage.setItem(storageKey, sessionId);
    }

    return sessionId;
}

function incrementVisitCount(): number {
    const storageKey = "pathing_visit_count";
    let count = parseInt(localStorage.getItem(storageKey) || "0", 10);
    count += 1;
    localStorage.setItem(storageKey, count.toString());
    return count;
}

function getLastSeenTime(): number | null {
    const storageKey = "pathing_last_seen";
    const lastSeen = localStorage.getItem(storageKey);
    return lastSeen ? parseInt(lastSeen, 10) : null;
}

function setLastSeenTime(): void {
    const storageKey = "pathing_last_seen";
    localStorage.setItem(storageKey, Date.now().toString());
}

function getFirstSeenTime(): number {
    const storageKey = "pathing_first_seen";
    let firstSeen = localStorage.getItem(storageKey);

    if (!firstSeen) {
        firstSeen = Date.now().toString();
        localStorage.setItem(storageKey, firstSeen);
    }

    return parseInt(firstSeen, 10);
}

function getEntryPage(): string | null {
    const storageKey = "pathing_entry_page";
    let entryPage = sessionStorage.getItem(storageKey);

    if (!entryPage) {
        entryPage = window.location.pathname;
        sessionStorage.setItem(storageKey, entryPage);
    }

    return entryPage;
}
