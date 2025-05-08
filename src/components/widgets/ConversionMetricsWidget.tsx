import React, { useMemo } from "react";
import { WidgetProps } from "@/types/widgets";
import BaseWidget from "./BaseWidget";
import { TimeFrame } from "@/components/analytica/EventTimelineChart";
import widgetRegistry from "@/utils/widgetRegistry";

// Add type for session info
type SessionInfo = {
    sessionId?: string;
    visitCount?: number;
    lastSeenAt?: number;
    firstSeenAt?: number;
    referrer?: string | null;
    entryPage?: string | null;
};

// Register widget definition
widgetRegistry.register({
    type: "conversionMetrics",
    name: "Conversion Metrics",
    description:
        "Track and visualize conversion rates based on specific pages and events",
    icon: "chart-pie", // Icon identifier
    constraints: {
        minWidth: 1,
        maxWidth: 2,
        minHeight: 2,
        maxHeight: 4,
        defaultWidth: 1,
        defaultHeight: 2,
    },
    configFields: [
        {
            key: "timeFrame",
            type: "timeFrame",
            label: "Time Frame",
            defaultValue: "30d",
            description: "Time period to analyze",
        },
        {
            key: "activatingPage",
            type: "page",
            label: "Activating Page",
            description: "The page that initiates the funnel (e.g., /shop)",
            required: true,
        },
        {
            key: "conversionEvent",
            type: "event",
            label: "Conversion Event",
            description: "The event that indicates a conversion",
            required: true,
        },
        {
            key: "filterProperty",
            type: "string",
            label: "Filter Property",
            description: "Property to filter on (e.g., quantity)",
        },
        {
            key: "filterOperator",
            type: "select",
            label: "Filter Operator",
            defaultValue: ">",
            options: [
                { label: "Greater than", value: ">" },
                { label: "Greater than or equal", value: ">=" },
                { label: "Equal", value: "=" },
                { label: "Less than", value: "<" },
                { label: "Less than or equal", value: "<=" },
                { label: "Contains", value: "contains" },
            ],
        },
        {
            key: "filterValue",
            type: "string",
            label: "Filter Value",
            description: "Value to compare against",
        },
    ],
});

const ConversionMetricsWidget: React.FC<WidgetProps> = (props) => {
    const { config, events, onSettingsChange } = props;

    // Get settings
    const timeFrame = (config.settings.timeFrame as TimeFrame) || "30d";
    const activatingPage = config.settings.activatingPage as string;
    const conversionEvent = config.settings.conversionEvent as string;
    const filterProperty = config.settings.filterProperty as string;
    const filterOperator = config.settings.filterProperty
        ? config.settings.filterOperator || ">"
        : undefined;
    const filterValue = config.settings.filterValue;

    // Custom settings component for this widget
    const renderSettings = () => {
        const allPaths = new Set<string>();

        // Collect all unique paths from events
        events.forEach((event) => {
            const path = event.payload?.path;
            if (path && typeof path === "string") {
                allPaths.add(path);
            }
        });

        const pathOptions = Array.from(allPaths);

        return (
            <div className="p-4 space-y-4">
                <h3 className="text-sm font-medium">
                    Configure Conversion Metrics
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                    Select the activating page and conversion event to track
                </p>

                <div className="space-y-1">
                    <label className="text-xs font-medium">
                        Activating Page
                    </label>
                    <select
                        className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm"
                        value={activatingPage || ""}
                        onChange={(e) => {
                            onSettingsChange(config.id, {
                                ...config.settings,
                                activatingPage: e.target.value,
                            });
                        }}
                    >
                        <option value="">Select a page</option>
                        {pathOptions.map((path) => (
                            <option key={path} value={path}>
                                {path}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-medium">
                        Conversion Event
                    </label>
                    <select
                        className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm"
                        value={conversionEvent || ""}
                        onChange={(e) => {
                            onSettingsChange(config.id, {
                                ...config.settings,
                                conversionEvent: e.target.value,
                            });
                        }}
                    >
                        <option value="">Select an event</option>
                        {Array.from(new Set(events.map((e) => e.type))).map(
                            (eventType) => (
                                <option key={eventType} value={eventType}>
                                    {eventType}
                                </option>
                            )
                        )}
                    </select>
                </div>
            </div>
        );
    };

    // Calculate conversion metrics
    const metrics = useMemo(() => {
        if (events.length === 0 || !activatingPage) {
            return { rate: 0, count: 0, total: 0, activatingPageVisits: 0 };
        }

        // Filter events by time frame
        const now = new Date();
        const startTime = new Date(now);

        switch (timeFrame) {
            case "1h":
                startTime.setHours(now.getHours() - 1);
                break;
            case "24h":
                startTime.setHours(now.getHours() - 24);
                break;
            case "7d":
                startTime.setDate(now.getDate() - 7);
                break;
            case "30d":
                startTime.setDate(now.getDate() - 30);
                break;
        }

        // Filter events by time frame
        const timeFilteredEvents = events.filter((event) => {
            const eventDate = new Date(event.created_at);
            return eventDate >= startTime;
        });

        // Find users who visited the activating page
        const usersVisitedActivatingPage = new Set();
        timeFilteredEvents.forEach((event) => {
            if (event.payload?.path === activatingPage) {
                const userId =
                    event.payload?.user_id ||
                    event.payload?.session_id ||
                    (event.session_info as SessionInfo | undefined)?.sessionId;
                if (userId) {
                    usersVisitedActivatingPage.add(userId);
                }
            }
        });

        // Count conversions from those users
        let conversions = 0;
        timeFilteredEvents.forEach((event) => {
            if (
                event.type === conversionEvent &&
                usersVisitedActivatingPage.has(
                    event.user_id || event.session_id
                )
            ) {
                // Apply filter if specified
                if (
                    filterProperty &&
                    filterOperator &&
                    filterValue !== undefined
                ) {
                    const propertyValue = event.payload?.[filterProperty];
                    if (propertyValue === undefined) return;

                    // Convert to number if both are numeric
                    const numericValue = !isNaN(Number(propertyValue))
                        ? Number(propertyValue)
                        : propertyValue;
                    const numericFilterValue = !isNaN(Number(filterValue))
                        ? Number(filterValue)
                        : filterValue;

                    // Apply filter based on operator
                    switch (filterOperator) {
                        case ">":
                            if (
                                numericValue === null ||
                                numericFilterValue === null ||
                                !(numericValue > numericFilterValue)
                            )
                                return;
                            break;
                        case ">=":
                            if (
                                numericValue === null ||
                                numericFilterValue === null ||
                                !(numericValue >= numericFilterValue)
                            )
                                return;
                            break;
                        case "=":
                            if (
                                numericValue === null ||
                                numericFilterValue === null ||
                                numericValue != numericFilterValue
                            )
                                return;
                            break;
                        case "<":
                            if (
                                numericValue === null ||
                                numericFilterValue === null ||
                                !(numericValue < numericFilterValue)
                            )
                                return;
                            break;
                        case "<=":
                            if (
                                numericValue === null ||
                                numericFilterValue === null ||
                                !(numericValue <= numericFilterValue)
                            )
                                return;
                            break;
                        case "contains":
                            if (
                                typeof propertyValue !== "string" ||
                                !propertyValue.includes(String(filterValue))
                            )
                                return;
                            break;
                    }
                }
                conversions++;
            }
        });

        const conversionRate =
            usersVisitedActivatingPage.size > 0
                ? (conversions / usersVisitedActivatingPage.size) * 100
                : 0;

        return {
            rate: conversionRate,
            count: conversions,
            total: timeFilteredEvents.length,
            activatingPageVisits: usersVisitedActivatingPage.size,
        };
    }, [
        events,
        timeFrame,
        activatingPage,
        conversionEvent,
        filterProperty,
        filterOperator,
        filterValue,
    ]);

    // Get time frame label
    const timeFrameLabel = useMemo(() => {
        switch (timeFrame) {
            case "1h":
                return "Last Hour";
            case "24h":
                return "Last 24 Hours";
            case "7d":
                return "Last 7 Days";
            case "30d":
                return "Last 30 Days";
            default:
                return "All Time";
        }
    }, [timeFrame]);

    return (
        <BaseWidget {...props} customSettings={renderSettings()}>
            <div className="h-full flex flex-col items-center justify-center p-2">
                {!activatingPage || !conversionEvent ? (
                    <div className="text-center text-gray-500 dark:text-gray-400">
                        Please configure the activating page and conversion
                        event in widget settings.
                    </div>
                ) : (
                    <>
                        <div className="text-3xl font-bold text-purple-700 dark:text-purple-500">
                            {metrics.rate.toFixed(1)}%
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-3">
                            Conversion Rate ({timeFrameLabel})
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                            {activatingPage} → {conversionEvent}
                            {filterProperty &&
                                filterOperator &&
                                filterValue !== undefined && (
                                    <span>
                                        {" "}
                                        ({String(filterProperty)}{" "}
                                        {String(filterOperator)}{" "}
                                        {String(filterValue)})
                                    </span>
                                )}
                        </div>
                        <div className="flex justify-between w-full max-w-[200px] text-xs text-gray-600 dark:text-gray-400">
                            <div className="text-center">
                                <div className="font-semibold">
                                    {metrics.activatingPageVisits}
                                </div>
                                <div>Page Visits</div>
                            </div>
                            <div className="text-center">
                                <div className="font-semibold">
                                    {metrics.count}
                                </div>
                                <div>Conversions</div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </BaseWidget>
    );
};

export default ConversionMetricsWidget;
