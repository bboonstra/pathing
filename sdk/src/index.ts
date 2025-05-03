/* eslint-disable @typescript-eslint/no-explicit-any */
import * as send from "./send";
import * as link from "./link";
import { send as rawSend } from "./send/raw";
import { link as rawLink } from "./link/raw";
import { Parameter } from "./core/parameter";
import { init } from "./core/init";
import { version } from "../package.json";

// SDK version
const SDK_VERSION = version;

// Create the pathing object
const pathing = {
    version: SDK_VERSION,
    send: {
        ...send,
        raw: rawSend,
    },
    link: {
        ...link,
        raw: rawLink,
    },
    Parameter,
    // Add init function to allow programmatic initialization
    init,
    // Backward compatibility with older track method
    track: (type: string, payload: Record<string, any>) => {
        console.warn(
            "pathing.track() is deprecated. Please use pathing.send.raw() instead."
        );
        return rawSend(type, payload);
    },
};

// Auto-initialize when script is loaded
if (typeof window !== "undefined") {
    (window as any).pathing = pathing;

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => init());
    } else {
        init();
    }
}

// Export the pathing object for ESM imports
export { pathing };

// Default export for simpler imports
export default pathing;
