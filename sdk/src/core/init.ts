import { config } from "./config";
import { sendEvent } from "./api";

export function init(apiKey?: string) {
    // Check if API key is provided directly to the function
    if (apiKey) {
        config.publicKey = apiKey;
    } else {
        // Check script tag first
        const scripts = document.querySelectorAll("script[pathing-api-key]");
        if (scripts.length > 0) {
            const publicKey = scripts[0].getAttribute("pathing-api-key");
            if (publicKey) {
                config.publicKey = publicKey;
            }
        } else {
            // If no script tag found, check for data attribute
            const dataKeyElement = document.querySelector(
                "[data-pathing-api-key]"
            );
            if (dataKeyElement) {
                const publicKey = dataKeyElement.getAttribute(
                    "data-pathing-api-key"
                );
                if (publicKey) {
                    config.publicKey = publicKey;
                }
            }
        }
        // No warning here - we'll check for API key validity when events are sent
    }

    // Only track pageview if we have a valid API key
    if (config.publicKey) {
        // Track initial pageview with enhanced data
        sendEvent("pageview", {
            // Basic page info
            path: window.location.pathname,
            url: window.location.href,
            referrer: document.referrer || null,
            title: document.title,

            // URL components
            hostname: window.location.hostname,
            search: window.location.search,
            hash: window.location.hash,
            protocol: window.location.protocol,

            // Page metadata
            metaDescription: getMetaContent("description"),
            metaKeywords: getMetaContent("keywords"),
            ogTitle: getMetaProperty("og:title"),
            ogType: getMetaProperty("og:type"),
            ogUrl: getMetaProperty("og:url"),
            ogImage: getMetaProperty("og:image"),

            // Navigation info
            isNewVisit:
                !document.referrer ||
                !document.referrer.includes(window.location.hostname),
            visitStartTime: Date.now(),

            // Document info
            characterCount: document.body
                ? document.body.textContent?.length
                : null,
            language: document.documentElement.lang,
        });

        // Set up listener for page visibility changes
        if (document.addEventListener) {
            document.addEventListener(
                "visibilitychange",
                handleVisibilityChange
            );
        }

        // Set up listener for before unload to track session duration
        window.addEventListener("beforeunload", trackPageDuration);
    }
}

// Helper functions for enhanced data collection
function getMetaContent(name: string): string | null {
    const meta = document.querySelector(`meta[name="${name}"]`);
    return meta ? meta.getAttribute("content") : null;
}

function getMetaProperty(property: string): string | null {
    const meta = document.querySelector(`meta[property="${property}"]`);
    return meta ? meta.getAttribute("content") : null;
}

// Store page load time to calculate duration
const pageLoadTime = Date.now();

// Track visibility changes (when user switches tabs)
function handleVisibilityChange() {
    if (document.visibilityState === "hidden") {
        // User switched away from the tab
        sendEvent("user_action", {
            action: "tab_blur",
            visibleDuration: Date.now() - pageLoadTime,
            path: window.location.pathname,
        });
    } else if (document.visibilityState === "visible") {
        // User returned to the tab
        sendEvent("user_action", {
            action: "tab_focus",
            path: window.location.pathname,
        });
    }
}

// Track page duration when user leaves
function trackPageDuration() {
    sendEvent("page_exit", {
        path: window.location.pathname,
        title: document.title,
        duration: Date.now() - pageLoadTime,
        scrollDepth: getScrollDepth(),
    });
}

// Calculate how far down the page the user scrolled
function getScrollDepth(): number {
    if (typeof window === "undefined" || !document.documentElement) {
        return 0;
    }

    const scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0;
    const scrollHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight
    );
    const clientHeight =
        document.documentElement.clientHeight || window.innerHeight;

    // Calculate scroll percentage (0 to 1)
    if (scrollHeight <= clientHeight) {
        return 1; // The entire page fits in the viewport
    }

    return Math.min(1, scrollTop / (scrollHeight - clientHeight));
}
