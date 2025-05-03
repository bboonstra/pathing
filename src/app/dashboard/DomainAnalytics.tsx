"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import EventTimelineChart, { TimeFrame } from "@/components/EventTimelineChart";

type Domain = {
    id: string;
    name: string;
    public_key: string;
    verified: boolean;
};

type Event = {
    id: string;
    domain_id: string;
    type: string;
    payload: {
        path?: string;
        referrer?: string;
        title?: string;
        [key: string]: string | number | boolean | null | undefined;
    } | null;
    created_at: string;
    sessionInfo?: {
        sessionId?: string;
        visitCount?: number;
        lastSeenAt?: number;
        firstSeenAt?: number;
        referrer?: string | null;
        entryPage?: string | null;
    };
    deviceInfo?: {
        userAgent?: string;
        language?: string;
        screenSize?: string;
        platform?: string;
        [key: string]: string | number | boolean | undefined;
    };
    metadata?: Record<
        string,
        {
            label: string;
            key: string;
        }
    >;
};

interface DomainAnalyticsProps {
    domainId?: string;
}

export default function DomainAnalytics({ domainId }: DomainAnalyticsProps) {
    const [domains, setDomains] = useState<Domain[]>([]);
    const [selectedDomain, setSelectedDomain] = useState<string | null>(
        domainId || null
    );
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [timeFrame, setTimeFrame] = useState<TimeFrame>("24h");
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

    // Fetch domains on component mount
    useEffect(() => {
        async function fetchDomains() {
            try {
                const { data, error } = await supabase
                    .from("domains")
                    .select("*")
                    .eq("verified", true);

                if (error) throw error;
                setDomains(data || []);

                // Auto-select the first domain if available and no domainId was provided
                if (!selectedDomain && data && data.length > 0) {
                    setSelectedDomain(data[0].id);
                }
            } catch (error) {
                setError(
                    error instanceof Error
                        ? error.message
                        : "An unknown error occurred"
                );
            } finally {
                if (!selectedDomain) {
                    setIsLoading(false);
                }
            }
        }

        fetchDomains();
    }, [selectedDomain]);

    // Fetch events when selected domain changes
    useEffect(() => {
        if (!selectedDomain) return;

        async function fetchEvents() {
            try {
                const { data, error } = await supabase
                    .from("events")
                    .select("*")
                    .eq("domain_id", selectedDomain)
                    .order("created_at", { ascending: false });

                if (error) throw error;
                setEvents(data || []);
            } catch (error) {
                setError(
                    error instanceof Error
                        ? error.message
                        : "An unknown error occurred"
                );
            } finally {
                setIsLoading(false);
            }
        }

        fetchEvents();
    }, [selectedDomain]);

    // Show message if no domains are available
    if (domains.length === 0 && !isLoading) {
        return (
            <div className="bg-white/70 dark:bg-[#23233a]/70 rounded-xl shadow-lg p-8 border border-white/20 dark:border-white/5 w-full mb-8">
                <h2 className="text-xl font-bold mb-6">Domain Analytics</h2>
                <div className="text-center py-10">
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                        No verified domains found. Verify a domain to view
                        analytics.
                    </p>
                    <a
                        href="/dashboard/add-domain"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                    >
                        Add & Verify Domain
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white/70 dark:bg-[#23233a]/70 rounded-xl shadow-lg p-8 border border-white/20 dark:border-white/5 w-full mb-8">
            <h2 className="text-xl font-bold mb-6">Domain Analytics</h2>

            {error && (
                <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
                    {error}
                </div>
            )}

            <div className="mb-6">
                <label
                    htmlFor="domain-select"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                    Select Domain
                </label>
                <select
                    id="domain-select"
                    value={selectedDomain || ""}
                    onChange={(e) => setSelectedDomain(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white/90 dark:bg-[#181824]/90 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isLoading}
                >
                    {domains.map((domain) => (
                        <option key={domain.id} value={domain.id}>
                            {domain.name}
                        </option>
                    ))}
                </select>
            </div>

            {isLoading ? (
                <div className="text-center py-10">
                    <p className="text-gray-500 dark:text-gray-400">
                        Loading data...
                    </p>
                </div>
            ) : (
                <>
                    <div className="mb-6 p-4 bg-white/40 dark:bg-[#212134]/40 rounded-lg border border-gray-200 dark:border-gray-800">
                        <h3 className="text-lg font-semibold mb-4">Overview</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-100 dark:border-blue-800">
                                <p className="text-blue-800 dark:text-blue-300 text-sm mb-1">
                                    Total Events
                                </p>
                                <p className="text-2xl font-bold">
                                    {events.length}
                                </p>
                            </div>
                            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-100 dark:border-purple-800">
                                <p className="text-purple-800 dark:text-purple-300 text-sm mb-1">
                                    Unique Pages
                                </p>
                                <p className="text-2xl font-bold">
                                    {
                                        new Set(
                                            events.map((e) => e.payload?.path)
                                        ).size
                                    }
                                </p>
                            </div>
                            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-100 dark:border-green-800">
                                <p className="text-green-800 dark:text-green-300 text-sm mb-1">
                                    Latest Event
                                </p>
                                <p className="text-lg font-bold">
                                    {events.length > 0
                                        ? new Date(
                                              new Date(
                                                  events[0].created_at
                                              ).getTime() -
                                                  new Date(
                                                      events[0].created_at
                                                  ).getTimezoneOffset() *
                                                      60000
                                          ).toLocaleString()
                                        : "N/A"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <EventTimelineChart
                        events={events}
                        timeFrame={timeFrame}
                        onTimeFrameChange={setTimeFrame}
                        isLoading={isLoading}
                    />

                    <div className="p-4 bg-white/40 dark:bg-[#212134]/40 rounded-lg border border-gray-200 dark:border-gray-800">
                        <h3 className="text-lg font-semibold mb-4">
                            Recent Events
                        </h3>

                        {events.length === 0 ? (
                            <p className="text-center py-6 text-gray-500 dark:text-gray-400">
                                No events recorded for this domain yet
                            </p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead>
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Time
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Event Type
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Page URL
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Referrer
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white/50 dark:bg-[#212134]/50 divide-y divide-gray-200 dark:divide-gray-800">
                                        {events.slice(0, 5).map((event) => (
                                            <tr
                                                key={event.id}
                                                className="hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer"
                                                onClick={() =>
                                                    setSelectedEvent(event)
                                                }
                                            >
                                                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                                                    {new Date(
                                                        event.created_at
                                                    ).toLocaleString()}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                                                    {event.type}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 max-w-[200px] truncate">
                                                    {event.payload?.path || "-"}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 max-w-[200px] truncate">
                                                    {event.payload?.referrer ||
                                                        "-"}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {events.length > 5 && (
                                    <div className="text-center mt-4">
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Showing 5 of {events.length} recent
                                            events
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
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
                                Event Details
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
                                    <p>
                                        {new Date(
                                            selectedEvent.created_at
                                        ).toLocaleString()}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Domain ID
                                    </p>
                                    <p className="font-mono text-sm">
                                        {selectedEvent.domain_id}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {selectedEvent.sessionInfo && (
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
                                            {selectedEvent.sessionInfo
                                                .sessionId || "N/A"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Visit Count
                                        </p>
                                        <p>
                                            {selectedEvent.sessionInfo
                                                .visitCount || "N/A"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            First Seen
                                        </p>
                                        <p>
                                            {selectedEvent.sessionInfo
                                                .firstSeenAt
                                                ? new Date(
                                                      selectedEvent.sessionInfo.firstSeenAt
                                                  ).toLocaleString()
                                                : "N/A"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Last Seen
                                        </p>
                                        <p>
                                            {selectedEvent.sessionInfo
                                                .lastSeenAt
                                                ? new Date(
                                                      selectedEvent.sessionInfo.lastSeenAt
                                                  ).toLocaleString()
                                                : "N/A"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Entry Page
                                        </p>
                                        <p className="truncate">
                                            {selectedEvent.sessionInfo
                                                .entryPage || "N/A"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Referrer
                                        </p>
                                        <p className="truncate">
                                            {selectedEvent.sessionInfo
                                                .referrer || "N/A"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {selectedEvent.deviceInfo && (
                            <div className="mb-4">
                                <h4 className="text-md font-medium border-b pb-2 mb-3 border-gray-200 dark:border-gray-700">
                                    Device Information
                                </h4>
                                <div className="grid grid-cols-2 gap-4 mb-3">
                                    {selectedEvent.deviceInfo.userAgent && (
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                User Agent
                                            </p>
                                            <p className="text-sm truncate">
                                                {
                                                    selectedEvent.deviceInfo
                                                        .userAgent
                                                }
                                            </p>
                                        </div>
                                    )}
                                    {selectedEvent.deviceInfo.platform && (
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Platform
                                            </p>
                                            <p>
                                                {
                                                    selectedEvent.deviceInfo
                                                        .platform
                                                }
                                            </p>
                                        </div>
                                    )}
                                    {selectedEvent.deviceInfo.language && (
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Language
                                            </p>
                                            <p>
                                                {
                                                    selectedEvent.deviceInfo
                                                        .language
                                                }
                                            </p>
                                        </div>
                                    )}
                                    {selectedEvent.deviceInfo.screenSize && (
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Screen Size
                                            </p>
                                            <p>
                                                {
                                                    selectedEvent.deviceInfo
                                                        .screenSize
                                                }
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {Object.keys(selectedEvent.deviceInfo).length >
                                    4 && (
                                    <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg overflow-x-auto">
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                            Additional Device Info
                                        </p>
                                        <pre className="font-mono text-xs">
                                            {JSON.stringify(
                                                Object.fromEntries(
                                                    Object.entries(
                                                        selectedEvent.deviceInfo
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

                        {selectedEvent.metadata &&
                            Object.keys(selectedEvent.metadata).length > 0 && (
                                <div className="mb-4">
                                    <h4 className="text-md font-medium border-b pb-2 mb-3 border-gray-200 dark:border-gray-700">
                                        Metadata
                                    </h4>
                                    <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto font-mono text-sm">
                                        {JSON.stringify(
                                            selectedEvent.metadata,
                                            null,
                                            2
                                        )}
                                    </pre>
                                </div>
                            )}

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
