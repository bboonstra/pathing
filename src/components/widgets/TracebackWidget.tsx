import React, { useState, useEffect } from "react";
import { WidgetProps, EventData, WidgetType } from "@/types/widgets";
import BaseWidget from "./BaseWidget";
import widgetRegistry from "@/utils/widgetRegistry";
import { TimeFrame } from "@/components/EventTimelineChart";

// Register widget definition
widgetRegistry.register({
    type: "traceback" as WidgetType,
    name: "Page Traceback",
    description:
        "Track what pages users visited before landing on a specific page",
    icon: "traceback",
    constraints: {
        minWidth: 2,
        maxWidth: 4,
        minHeight: 2,
        maxHeight: 4,
        defaultWidth: 2,
        defaultHeight: 2,
    },
    configFields: [
        {
            key: "targetPage",
            type: "string",
            label: "Target Page",
            description:
                "Page to trace visitors back from (e.g., '/checkout' or '404')",
        },
        {
            key: "is404",
            type: "boolean",
            label: "404 Pages",
            description: "Track all 404 pages instead of a specific URL",
            defaultValue: false,
        },
        {
            key: "maxDepth",
            type: "number",
            label: "Maximum Traceback Depth",
            description: "Maximum number of pages to track back",
            defaultValue: 3,
        },
        {
            key: "timeFrame",
            type: "timeFrame",
            label: "Time Frame",
            description: "Time period to analyze",
            defaultValue: "7d",
        },
    ],
});

interface TracebackData {
    sourcePage: string;
    count: number;
    percentage: number;
}

const TracebackWidget: React.FC<WidgetProps> = ({
    config,
    domainId,
    events,
    isLoading,
    onSettingsChange,
}) => {
    const [tracebackData, setTracebackData] = useState<TracebackData[]>([]);

    // Extract settings
    const targetPage = config.settings.targetPage as string;
    const is404 = config.settings.is404 as boolean;
    const maxDepth = (config.settings.maxDepth as number) || 3;

    useEffect(() => {
        if (isLoading || !events.length) return;

        console.log("[TRACEBACK DEBUG] Starting traceback calculation", {
            targetPage,
            is404,
            maxDepth,
            eventsCount: events.length,
        });

        // Function to check if a page is a 404
        const is404Page = (page: string) => {
            return (
                page.includes("404") ||
                page.includes("not-found") ||
                page.endsWith("not_found")
            );
        };

        // Function to determine if this is our target page
        const isTargetPage = (page: string) => {
            if (is404) {
                return is404Page(page);
            }
            return page === targetPage;
        };

        // Group events by session
        const sessionEvents: Record<string, EventData[]> = {};
        events.forEach((event) => {
            const sessionId = (event.payload?.session_id ||
                event.payload?.user_id ||
                `${event.payload?.ip}-${new Date(
                    event.created_at
                ).toDateString()}`) as string;

            if (!sessionId) return;

            if (!sessionEvents[sessionId]) {
                sessionEvents[sessionId] = [];
            }

            sessionEvents[sessionId].push(event);
        });

        console.log("[TRACEBACK DEBUG] Grouped events by session", {
            uniqueSessionsCount: Object.keys(sessionEvents).length,
        });

        // Track pages that led to the target page
        const sourcePages: Record<string, number> = {};
        let totalTargetHits = 0;

        // Analyze each session for paths leading to the target page
        Object.entries(sessionEvents).forEach(([sessionId, sessionEvts]) => {
            // Sort events by timestamp
            sessionEvts.sort(
                (a, b) =>
                    new Date(a.created_at).getTime() -
                    new Date(b.created_at).getTime()
            );

            // Get paths from this session with timestamps
            const visits = sessionEvts
                .filter((e) => e.payload?.path)
                .map((e) => ({
                    path: e.payload?.path as string,
                    timestamp: new Date(e.created_at).getTime(),
                }));

            console.log(`[TRACEBACK DEBUG] Analyzing session ${sessionId}`, {
                eventsInSession: sessionEvts.length,
                pageVisitsFound: visits.length,
            });

            // Look for target pages
            for (let i = 0; i < visits.length; i++) {
                if (isTargetPage(visits[i].path)) {
                    totalTargetHits++;
                    console.log(
                        `[TRACEBACK DEBUG] Found target page hit: ${visits[i].path}`
                    );

                    // Look back up to maxDepth pages
                    let depth = 1;
                    for (
                        let j = i - 1;
                        j >= 0 && depth <= maxDepth;
                        j--, depth++
                    ) {
                        const sourcePage = visits[j].path;
                        sourcePages[sourcePage] =
                            (sourcePages[sourcePage] || 0) + 1;
                        console.log(
                            `[TRACEBACK DEBUG] Found source page at depth ${depth}: ${sourcePage}`
                        );
                    }
                }
            }
        });

        console.log("[TRACEBACK DEBUG] Finished analyzing all sessions", {
            totalTargetHits,
            uniqueSourcePages: Object.keys(sourcePages).length,
            sourcePages,
        });

        // Convert to array with percentages and sort by count
        const tracebackResults = Object.entries(sourcePages)
            .map(([sourcePage, count]) => ({
                sourcePage,
                count,
                percentage: totalTargetHits
                    ? (count / totalTargetHits) * 100
                    : 0,
            }))
            .sort((a, b) => b.count - a.count);

        console.log(
            "[TRACEBACK DEBUG] Final traceback results",
            tracebackResults
        );
        setTracebackData(tracebackResults);
    }, [events, isLoading, targetPage, is404, maxDepth]);

    // Custom settings component for easier selection of pages
    const renderSettings = () => {
        // Get all unique pages from events
        const pages = [
            ...new Set(
                events
                    .map((e) => (e.payload?.path as string) || "")
                    .filter(Boolean)
            ),
        ];

        return (
            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Track 404 Pages Instead
                    </label>
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            checked={config.settings.is404 as boolean}
                            onChange={(e) => {
                                onSettingsChange(config.id, {
                                    ...config.settings,
                                    is404: e.target.checked,
                                });
                            }}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                            Track all 404/not found pages
                        </span>
                    </div>
                </div>

                {!(config.settings.is404 as boolean) && (
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Target Page
                        </label>
                        <select
                            value={config.settings.targetPage as string}
                            onChange={(e) => {
                                onSettingsChange(config.id, {
                                    ...config.settings,
                                    targetPage: e.target.value,
                                });
                            }}
                            className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-sm"
                        >
                            <option value="">Select a page</option>
                            {pages.map((page) => (
                                <option key={page} value={page}>
                                    {page}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Maximum Traceback Depth
                    </label>
                    <input
                        type="number"
                        min="1"
                        max="10"
                        value={config.settings.maxDepth as number}
                        onChange={(e) => {
                            onSettingsChange(config.id, {
                                ...config.settings,
                                maxDepth: parseInt(e.target.value, 10),
                            });
                        }}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-sm"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Time Frame
                    </label>
                    <select
                        value={(config.settings.timeFrame as TimeFrame) || "7d"}
                        onChange={(e) => {
                            onSettingsChange(config.id, {
                                ...config.settings,
                                timeFrame: e.target.value as TimeFrame,
                            });
                        }}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-sm"
                    >
                        <option value="1h">Last Hour</option>
                        <option value="24h">Last 24 Hours</option>
                        <option value="7d">Last 7 Days</option>
                        <option value="30d">Last 30 Days</option>
                    </select>
                </div>
            </div>
        );
    };

    return (
        <BaseWidget
            config={config}
            domainId={domainId}
            events={events}
            isLoading={isLoading}
            onSettingsChange={onSettingsChange}
            customSettings={renderSettings()}
        >
            <div className="h-full flex flex-col">
                <div className="text-center mb-3">
                    <h4 className="text-sm font-medium">
                        Pages leading to:{" "}
                        {is404 ? "404 Pages" : targetPage || "Select a page"}
                    </h4>
                </div>

                {!targetPage && !is404 ? (
                    <div className="flex-grow flex items-center justify-center text-gray-500 text-sm">
                        Please select a target page or enable 404 tracking in
                        settings
                    </div>
                ) : tracebackData.length === 0 ? (
                    <div className="flex-grow flex items-center justify-center text-gray-500 text-sm">
                        No traceback data available
                    </div>
                ) : (
                    <div className="flex-grow overflow-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-800">
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                                    >
                                        Source Page
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                                    >
                                        Count
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                                    >
                                        %
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                                {tracebackData.map((item) => (
                                    <tr key={item.sourcePage}>
                                        <td className="px-3 py-2 text-xs text-gray-900 dark:text-gray-300 truncate max-w-[120px]">
                                            {item.sourcePage}
                                        </td>
                                        <td className="px-3 py-2 text-xs text-gray-900 dark:text-gray-300 text-right">
                                            {item.count}
                                        </td>
                                        <td className="px-3 py-2 text-xs text-gray-900 dark:text-gray-300 text-right">
                                            {item.percentage.toFixed(1)}%
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </BaseWidget>
    );
};

export default TracebackWidget;
