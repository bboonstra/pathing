/**
 * Utility to collect detailed device, browser, and environment information
 * for enhanced analytics tracking
 */
export declare const DeviceInfo: {
    /**
     * Get detailed browser information
     */
    getBrowserInfo(): Record<string, any>;
    /**
     * Get network and connection information when available
     */
    getConnectionInfo(): Record<string, any>;
    /**
     * Get performance and timing information
     */
    getPerformanceInfo(): Record<string, any>;
    /**
     * Get geolocation if available and allowed by the user
     * This is an async function as it requires permission
     */
    getGeolocation(): Promise<Record<string, any>>;
    /**
     * Get all available client information
     */
    getAllInfo(): Promise<Record<string, any>>;
};
