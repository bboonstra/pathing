/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Utility to collect detailed device, browser, and environment information
 * for enhanced analytics tracking
 */
export const DeviceInfo = {
    /**
     * Get detailed browser information
     */
    getBrowserInfo(): Record<string, any> {
        if (typeof window === "undefined" || typeof navigator === "undefined") {
            return {};
        }

        return {
            userAgent: navigator.userAgent,
            language: navigator.language,
            languages: Array.from(navigator.languages || []),
            cookieEnabled: navigator.cookieEnabled,
            doNotTrack:
                navigator.doNotTrack ||
                (navigator as any).doNotTrack ||
                (window as any).doNotTrack,
            vendor: navigator.vendor,
            platform: navigator.platform,
            screenWidth: window.screen.width,
            screenHeight: window.screen.height,
            screenColorDepth: window.screen.colorDepth,
            screenPixelDepth: window.screen.pixelDepth,
            innerWidth: window.innerWidth,
            innerHeight: window.innerHeight,
            devicePixelRatio: window.devicePixelRatio,
            orientation:
                typeof window.screen.orientation === "object"
                    ? window.screen.orientation.type
                    : "unknown",
        };
    },

    /**
     * Get network and connection information when available
     */
    getConnectionInfo(): Record<string, any> {
        if (
            typeof navigator === "undefined" ||
            !(navigator as any).connection
        ) {
            return {};
        }

        const conn = (navigator as any).connection;

        return {
            effectiveType: conn.effectiveType,
            downlink: conn.downlink,
            rtt: conn.rtt,
            saveData: conn.saveData,
        };
    },

    /**
     * Get performance and timing information
     */
    getPerformanceInfo(): Record<string, any> {
        if (typeof window === "undefined" || !window.performance) {
            return {};
        }

        // Try to get navigation timing data
        let timing: Record<string, any> = {};

        if (window.performance.timing) {
            const t = window.performance.timing;
            timing = {
                connectEnd: t.connectEnd,
                connectStart: t.connectStart,
                domComplete: t.domComplete,
                domContentLoadedEventEnd: t.domContentLoadedEventEnd,
                domContentLoadedEventStart: t.domContentLoadedEventStart,
                domInteractive: t.domInteractive,
                domLoading: t.domLoading,
                domainLookupEnd: t.domainLookupEnd,
                domainLookupStart: t.domainLookupStart,
                fetchStart: t.fetchStart,
                loadEventEnd: t.loadEventEnd,
                loadEventStart: t.loadEventStart,
                navigationStart: t.navigationStart,
                redirectEnd: t.redirectEnd,
                redirectStart: t.redirectStart,
                requestStart: t.requestStart,
                responseEnd: t.responseEnd,
                responseStart: t.responseStart,
                unloadEventEnd: t.unloadEventEnd,
                unloadEventStart: t.unloadEventStart,
            };
        }

        return {
            timing,
            memory: (window.performance as any).memory
                ? {
                      jsHeapSizeLimit: (window.performance as any).memory
                          .jsHeapSizeLimit,
                      totalJSHeapSize: (window.performance as any).memory
                          .totalJSHeapSize,
                      usedJSHeapSize: (window.performance as any).memory
                          .usedJSHeapSize,
                  }
                : {},
        };
    },

    /**
     * Get geolocation if available and allowed by the user
     * This is an async function as it requires permission
     */
    getGeolocation(): Promise<Record<string, any>> {
        return new Promise((resolve) => {
            if (typeof navigator === "undefined" || !navigator.geolocation) {
                resolve({});
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy,
                        altitude: position.coords.altitude,
                        altitudeAccuracy: position.coords.altitudeAccuracy,
                        heading: position.coords.heading,
                        speed: position.coords.speed,
                        timestamp: position.timestamp,
                    });
                },
                () => {
                    // If user denies permission or error occurs
                    resolve({});
                },
                {
                    timeout: 1000,
                    maximumAge: 60000,
                }
            );
        });
    },

    /**
     * Get all available client information
     */
    async getAllInfo(): Promise<Record<string, any>> {
        const browserInfo = this.getBrowserInfo();
        const connectionInfo = this.getConnectionInfo();
        const performanceInfo = this.getPerformanceInfo();

        // Don't wait for geolocation as it requires user permission
        // and might timeout, which would delay event tracking
        // Instead, include it when/if it becomes available

        return {
            browser: browserInfo,
            connection: connectionInfo,
            performance: performanceInfo,
            timestamp: Date.now(),
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            timezoneOffset: new Date().getTimezoneOffset(),
            url: window.location.href,
            hostname: window.location.hostname,
            pathname: window.location.pathname,
            search: window.location.search,
            hash: window.location.hash,
            isSecure: window.location.protocol === "https:",
            hasTouchScreen:
                "ontouchstart" in window || navigator.maxTouchPoints > 0,
            browserFingerprint: createSimpleFingerprint(browserInfo),
        };
    },
};

/**
 * Create a simple browser fingerprint based on available information
 * This is not cryptographically secure but helps identify unique browsers
 */
function createSimpleFingerprint(browserInfo: Record<string, any>): string {
    // Use a combination of browser parameters to create a simple fingerprint
    const fingerprintData = [
        browserInfo.userAgent,
        browserInfo.language,
        browserInfo.platform,
        browserInfo.screenWidth,
        browserInfo.screenHeight,
        browserInfo.screenColorDepth,
        navigator.plugins ? navigator.plugins.length : 0,
        new Date().getTimezoneOffset(),
        Intl.DateTimeFormat().resolvedOptions().timeZone,
    ].join("|");

    // Simple hash function for the fingerprint
    return hashString(fingerprintData);
}

/**
 * Simple string hashing function
 */
function hashString(str: string): string {
    let hash = 0;
    if (str.length === 0) return hash.toString(16);

    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32bit integer
    }

    return Math.abs(hash).toString(16);
}
