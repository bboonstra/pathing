"use client";

import { useState, useEffect } from "react";

type Event = {
    id: string;
    domain_id: string;
    type: string;
    payload: {
        action?: string;
        location?: string;
        buttonId?: string;
        [key: string]: string | number | boolean | null | undefined;
    } | null;
    created_at: string;
    session_info?: {
        sessionId?: string;
        visitCount?: number;
        lastSeenAt?: number;
        firstSeenAt?: number;
        referrer?: string | null;
        entryPage?: string | null;
    };
    device_info?: {
        userAgent?: string;
        language?: string;
        screenSize?: string;
        platform?: string;
        [key: string]: string | number | boolean | undefined;
    };
};

export default function HomepageAnalytics() {
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const [refreshCountdown, setRefreshCountdown] = useState<number | null>(
        null
    );
    const [error, setError] = useState<string | null>(null);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

    // Function to fetch events from our cached API endpoint
    const fetchEvents = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/demo");
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.error || "Failed to fetch analytics data"
                );
            }

            const result = await response.json();
            setEvents(result.data || []);
            setLastUpdated(new Date());
            setRefreshCountdown(result.refreshesIn || null);
        } catch (error) {
            console.error(
                "Error fetching analytics:",
                error instanceof Error ? error.message : String(error)
            );
            setError(
                error instanceof Error
                    ? error.message
                    : "An unknown error occurred"
            );
            setEvents([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Add useEffect to fetch events on component mount
    useEffect(() => {
        fetchEvents();
    }, []);

    // Countdown timer effect
    useEffect(() => {
        if (refreshCountdown === null || refreshCountdown <= 0) return;

        const timer = setInterval(() => {
            setRefreshCountdown((prev) =>
                prev !== null ? Math.max(0, prev - 1) : null
            );
        }, 1000);

        return () => clearInterval(timer);
    }, [refreshCountdown]);

    // Format time from seconds to a readable format
    const formatTime = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;

        if (hours === 0) {
            return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
        }

        return `${hours} hour${
            hours !== 1 ? "s" : ""
        } and ${remainingMinutes} minute${remainingMinutes !== 1 ? "s" : ""}`;
    };

    // Calculate hourly distribution of events
    const hourlyData = Array(24).fill(0);
    const currentHour = new Date().getHours();

    events.forEach((event) => {
        const eventDate = new Date(event.created_at);
        const eventHour = eventDate.getHours();
        // Calculate relative position with latest hour on the right
        const hourIndex = (24 + eventHour - currentHour - 1) % 24;
        hourlyData[hourIndex]++;
    });

    // Find max for scaling
    const maxEvents = Math.max(...hourlyData, 1);

    // Determine if refresh is available
    const canRefresh = refreshCountdown === 0 || refreshCountdown === null;

    // Format relative hour label
    const formatRelativeHour = (hoursAgo: number): string => {
        if (hoursAgo === 0) {
            return "Now";
        } else if (hoursAgo === 1) {
            return "1 hr ago";
        } else if (hoursAgo === 24) {
            return "24 hrs ago";
        } else {
            return `${hoursAgo} hrs ago`;
        }
    };

    return (
        <div className="w-full bg-white/70 dark:bg-[#23233a]/70 rounded-xl shadow-lg p-8 border border-white/20 dark:border-white/5 mb-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Live Demo Analytics</h2>
                <div className="flex items-center gap-3">
                    <div className="text-xs text-gray-500">
                        {lastUpdated ? (
                            <>
                                {refreshCountdown !== null &&
                                refreshCountdown > 0 ? (
                                    <span>
                                        Updated at{" "}
                                        {lastUpdated.toLocaleTimeString([], {
                                            hour: "numeric",
                                            minute: "2-digit",
                                        })}{" "}
                                        • New data available in{" "}
                                        {formatTime(refreshCountdown)}
                                    </span>
                                ) : (
                                    <span>Refresh available</span>
                                )}
                            </>
                        ) : (
                            "Not yet updated"
                        )}
                    </div>
                    {canRefresh && (
                        <button
                            onClick={fetchEvents}
                            className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-800/30"
                        >
                            Refresh
                        </button>
                    )}
                </div>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
                    {error}
                </div>
            )}

            {isLoading ? (
                <div className="text-center py-10">
                    <p className="text-gray-500 dark:text-gray-400">
                        Loading analytics...
                    </p>
                </div>
            ) : (
                <>
                    <div className="mb-6 p-4 bg-white/40 dark:bg-[#212134]/40 rounded-lg border border-gray-200 dark:border-gray-800">
                        <h3 className="text-lg font-semibold mb-4">Overview</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-100 dark:border-blue-800">
                                <p className="text-blue-800 dark:text-blue-300 text-sm mb-1">
                                    Clicks Today
                                </p>
                                <p className="text-2xl font-bold">
                                    {events.length}
                                </p>
                            </div>
                            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-100 dark:border-green-800">
                                <p className="text-green-800 dark:text-green-300 text-sm mb-1">
                                    Peak Hour
                                </p>
                                <p className="text-2xl font-bold">
                                    {hourlyData.every((val) => val === 0)
                                        ? "N/A"
                                        : (() => {
                                              const peakHour =
                                                  hourlyData.indexOf(
                                                      Math.max(...hourlyData)
                                                  );
                                              const ampm =
                                                  peakHour >= 12 ? "PM" : "AM";
                                              const hour12 =
                                                  peakHour % 12 || 12;
                                              return `${hour12} ${ampm}`;
                                          })()}
                                </p>
                            </div>
                            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-100 dark:border-purple-800">
                                <p className="text-purple-800 dark:text-purple-300 text-sm mb-1">
                                    Latest Click
                                </p>
                                <p className="text-2xl font-bold">
                                    {events.length > 0
                                        ? new Date(
                                              events[0].created_at
                                          ).toLocaleTimeString("en-US", {
                                              hour12: true,
                                              hour: "numeric",
                                              minute: "2-digit",
                                              second: "2-digit",
                                          })
                                        : "N/A"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mb-6 p-4 bg-white/40 dark:bg-[#212134]/40 rounded-lg border border-gray-200 dark:border-gray-800">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-semibold">
                                Hourly Distribution (Local Time)
                            </h3>
                            <div className="flex gap-2">
                                {/* Could add timeframe selector buttons here like in DomainAnalytics if needed */}
                            </div>
                        </div>
                        <div className="h-32 flex items-end space-x-1 mt-4">
                            {hourlyData.map((count, hour) => (
                                <div
                                    key={hour}
                                    className={`flex-1 rounded-t transition-all duration-500 relative group ${
                                        hour === 23
                                            ? "bg-[repeating-linear-gradient(-45deg,rgba(27,80,212,1.0),rgba(27,80,212,1.0)_10px,rgba(27,80,212,0.5)_10px,rgba(27,80,212,0.5)_20px)] dark:bg-[repeating-linear-gradient(-45deg,rgba(27,80,212,1.0),rgba(27,80,212,1.0)_10px,rgba(27,80,212,0.5)_10px,rgba(27,80,212,0.5)_20px)] hover:bg-[repeating-linear-gradient(-45deg,rgba(27,80,212,1.0),rgba(27,80,212,1.0)_10px,rgba(27,80,212,0.5)_10px,rgba(27,80,212,0.5)_20px)] dark:hover:bg-[repeating-linear-gradient(-45deg,rgba(27,80,212,1.0),rgba(27,80,212,1.0)_10px,rgba(27,80,212,0.5)_10px,rgba(27,80,212,0.5)_20px)]"
                                            : "bg-blue-500/80 dark:bg-blue-600/80 hover:bg-blue-600 dark:hover:bg-blue-500"
                                    }`}
                                    style={{
                                        height: `${Math.max(
                                            (count / maxEvents) * 100,
                                            4
                                        )}%`,
                                    }}
                                >
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity mb-1 whitespace-nowrap">
                                        {formatRelativeHour(23 - hour)} -{" "}
                                        {count} clicks
                                        {hour === 23 && " (incomplete)"}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-2">
                            {/* Generate 5 evenly spaced hour markers for the last 24 hours */}
                            {[24, 18, 12, 6, 0].map((hoursAgo) => (
                                <span key={hoursAgo}>
                                    {formatRelativeHour(hoursAgo)}
                                </span>
                            ))}
                        </div>
                        <div className="text-xs text-gray-500 mt-2 text-center">
                            All times shown in local time zone
                        </div>
                    </div>
                </>
            )}

            {/* Event Details Popup */}
            {selectedEvent && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                    onClick={() => setSelectedEvent(null)}
                >
                    <div
                        className="bg-white dark:bg-[#23233a] rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">
                                Click Event Details
                            </h3>
                            <button
                                onClick={() => setSelectedEvent(null)}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>

                        <div className="mb-4">
                            <h4 className="text-md font-medium border-b pb-2 mb-3 border-gray-200 dark:border-gray-700">
                                Basic Information
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Event ID
                                    </p>
                                    <p className="font-mono text-sm">
                                        {selectedEvent.id}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Event Type
                                    </p>
                                    <p className="font-medium">
                                        {selectedEvent.type}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Created At
                                    </p>
                                    <p>{selectedEvent.created_at}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Button ID
                                    </p>
                                    <p className="font-medium">
                                        {selectedEvent.payload?.buttonId ||
                                            "N/A"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {selectedEvent.session_info && (
                            <div className="mb-4">
                                <h4 className="text-md font-medium border-b pb-2 mb-3 border-gray-200 dark:border-gray-700">
                                    Session Information
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Session ID
                                        </p>
                                        <p className="font-mono text-sm">
                                            {selectedEvent.session_info
                                                .sessionId || "N/A"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Visit Count
                                        </p>
                                        <p>
                                            {selectedEvent.session_info
                                                .visitCount || "N/A"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            First Seen
                                        </p>
                                        <p>
                                            {selectedEvent.session_info
                                                .firstSeenAt
                                                ? new Date(
                                                      selectedEvent.session_info.firstSeenAt
                                                  ).toLocaleString()
                                                : "N/A"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Last Seen
                                        </p>
                                        <p>
                                            {selectedEvent.session_info
                                                .lastSeenAt
                                                ? new Date(
                                                      selectedEvent.session_info.lastSeenAt
                                                  ).toLocaleString()
                                                : "N/A"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Entry Page
                                        </p>
                                        <p className="truncate">
                                            {selectedEvent.session_info
                                                .entryPage || "N/A"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Referrer
                                        </p>
                                        <p className="truncate">
                                            {selectedEvent.session_info
                                                .referrer || "N/A"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {selectedEvent.device_info && (
                            <div className="mb-4">
                                <h4 className="text-md font-medium border-b pb-2 mb-3 border-gray-200 dark:border-gray-700">
                                    Device Information
                                </h4>
                                <div className="grid grid-cols-2 gap-4 mb-3">
                                    {selectedEvent.device_info.userAgent && (
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                User Agent
                                            </p>
                                            <p className="text-sm truncate">
                                                {
                                                    selectedEvent.device_info
                                                        .userAgent
                                                }
                                            </p>
                                        </div>
                                    )}
                                    {selectedEvent.device_info.platform && (
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Platform
                                            </p>
                                            <p>
                                                {
                                                    selectedEvent.device_info
                                                        .platform
                                                }
                                            </p>
                                        </div>
                                    )}
                                    {selectedEvent.device_info.language && (
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Language
                                            </p>
                                            <p>
                                                {
                                                    selectedEvent.device_info
                                                        .language
                                                }
                                            </p>
                                        </div>
                                    )}
                                    {selectedEvent.device_info.screenSize && (
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Screen Size
                                            </p>
                                            <p>
                                                {
                                                    selectedEvent.device_info
                                                        .screenSize
                                                }
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {Object.keys(selectedEvent.device_info).length >
                                    4 && (
                                    <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg overflow-x-auto">
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                            Additional Device Info
                                        </p>
                                        <pre className="font-mono text-xs">
                                            {JSON.stringify(
                                                Object.fromEntries(
                                                    Object.entries(
                                                        selectedEvent.device_info
                                                    ).filter(
                                                        ([key]) =>
                                                            ![
                                                                "userAgent",
                                                                "platform",
                                                                "language",
                                                                "screenSize",
                                                            ].includes(key)
                                                    )
                                                ),
                                                null,
                                                2
                                            )}
                                        </pre>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="mb-4">
                            <h4 className="text-md font-medium border-b pb-2 mb-3 border-gray-200 dark:border-gray-700">
                                Payload
                            </h4>
                            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto font-mono text-sm">
                                {JSON.stringify(
                                    selectedEvent.payload,
                                    null,
                                    2
                                ) || "null"}
                            </pre>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => setSelectedEvent(null)}
                                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
