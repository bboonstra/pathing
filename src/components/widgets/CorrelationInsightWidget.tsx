import React, { useState } from "react";
import { WidgetProps } from "@/types/widgets";
import BaseWidget from "./BaseWidget";
import widgetRegistry from "@/utils/widgetRegistry";

// Register widget definition
widgetRegistry.register({
    type: "customInsight",
    name: "Correlation Insight",
    description: "Visualize correlations and patterns found in your data",
    icon: "chart-pie",
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
            key: "insightType",
            type: "select",
            label: "Insight Type",
            defaultValue: "general",
            options: [
                { label: "General", value: "general" },
                { label: "User Journey", value: "userJourney" },
                { label: "Referrer Conversion", value: "referrerConversion" },
                { label: "Time Pattern", value: "timePattern" },
                { label: "Page Performance", value: "pagePerformance" },
            ],
            description: "Type of correlation insight to display",
        },
        {
            key: "description",
            type: "string",
            label: "Description",
            description: "Custom description for this insight",
            defaultValue: "Insight based on data correlation analysis",
        },
    ],
});

const CorrelationInsightWidget: React.FC<WidgetProps> = ({
    config,
    domainId,
    events,
    isLoading,
    onSettingsChange,
}) => {
    const [activeTab, setActiveTab] = useState<string>("summary");
    const insightType = (config.settings.insightType as string) || "general";
    const description =
        (config.settings.description as string) ||
        "Insight based on data correlation analysis";

    // Render different views based on the insight type
    const renderInsightContent = () => {
        switch (insightType) {
            case "userJourney":
                return renderUserJourneyInsight();
            case "referrerConversion":
                return renderReferrerConversionInsight();
            case "timePattern":
                return renderTimePatternInsight();
            case "pagePerformance":
                return renderPagePerformanceInsight();
            default:
                return (
                    <div className="text-center p-4 text-gray-500 dark:text-gray-400">
                        No detailed data available for this insight.
                    </div>
                );
        }
    };

    // User journey insight visualization
    const renderUserJourneyInsight = () => {
        const journeyData =
            (config.settings.journeyData as [string, number][]) || [];

        if (!journeyData.length) {
            return (
                <div className="text-center p-4 text-gray-500 dark:text-gray-400">
                    No journey data available.
                </div>
            );
        }

        return (
            <div className="space-y-2 p-2">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {description}
                </p>
                <div className="space-y-2">
                    {journeyData.map(([path, count], index) => (
                        <div
                            key={index}
                            className="bg-gray-50 dark:bg-gray-800 p-2 rounded-md"
                        >
                            <div className="text-sm font-medium">{path}</div>
                            <div className="mt-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
                                    style={{
                                        width: `${
                                            (count / journeyData[0][1]) * 100
                                        }%`,
                                    }}
                                ></div>
                            </div>
                            <div className="text-xs text-right mt-1 text-gray-500 dark:text-gray-400">
                                {count} users
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // Referrer conversion insight visualization
    const renderReferrerConversionInsight = () => {
        const conversionData =
            (config.settings.conversionData as Array<{
                referrer: string;
                conversionRate: number;
                count: number;
                total: number;
            }>) || [];

        if (!conversionData.length) {
            return (
                <div className="text-center p-4 text-gray-500 dark:text-gray-400">
                    No conversion data available.
                </div>
            );
        }

        return (
            <div className="space-y-2 p-2">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {description}
                </p>
                <div className="space-y-3">
                    {conversionData.map((item, index) => (
                        <div
                            key={index}
                            className="bg-gray-50 dark:bg-gray-800 p-2 rounded-md"
                        >
                            <div className="flex justify-between">
                                <div className="text-sm font-medium truncate max-w-[70%]">
                                    {item.referrer}
                                </div>
                                <div className="text-sm font-semibold text-right">
                                    {(item.conversionRate * 100).toFixed(1)}%
                                </div>
                            </div>
                            <div className="mt-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-green-500 to-green-300"
                                    style={{
                                        width: `${item.conversionRate * 100}%`,
                                    }}
                                ></div>
                            </div>
                            <div className="text-xs text-right mt-1 text-gray-500 dark:text-gray-400">
                                {item.count} / {item.total} conversions
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // Time pattern insight visualization
    const renderTimePatternInsight = () => {
        const timeData =
            (config.settings.timeData as {
                dayOfWeekCounts: number[];
                hourCounts: number[];
                peakDay: string;
                peakHour: string;
            }) || null;

        if (!timeData) {
            return (
                <div className="text-center p-4 text-gray-500 dark:text-gray-400">
                    No time pattern data available.
                </div>
            );
        }

        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const maxDayCount = Math.max(...timeData.dayOfWeekCounts);

        return (
            <div className="space-y-2 p-2">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {description}
                </p>

                <div className="mb-4">
                    <div className="text-sm font-medium mb-2">
                        Day of Week Activity
                    </div>
                    <div className="flex justify-between items-end h-36">
                        {timeData.dayOfWeekCounts.map((count, index) => (
                            <div
                                key={index}
                                className="flex flex-col items-center flex-1"
                            >
                                <div
                                    className={`w-full mx-0.5 rounded-t-sm ${
                                        days[index] ===
                                        timeData.peakDay.substring(0, 3)
                                            ? "bg-purple-500"
                                            : "bg-blue-400"
                                    }`}
                                    style={{
                                        height: `${
                                            (count / maxDayCount) * 100
                                        }%`,
                                    }}
                                ></div>
                                <div className="text-xs mt-1">
                                    {days[index]}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="text-sm mt-3">
                    Peak activity:{" "}
                    <span className="font-semibold">
                        {timeData.peakDay}s at {timeData.peakHour}
                    </span>
                </div>
            </div>
        );
    };

    // Page performance insight visualization
    const renderPagePerformanceInsight = () => {
        const pageData =
            (config.settings.pageData as Array<{
                path: string;
                eventCount: number;
                uniqueVisitors: number;
            }>) || [];

        if (!pageData.length) {
            return (
                <div className="text-center p-4 text-gray-500 dark:text-gray-400">
                    No page performance data available.
                </div>
            );
        }

        // Get max values for scaling
        const maxEvents = Math.max(...pageData.map((p) => p.eventCount));

        return (
            <div className="space-y-2 p-2">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {description}
                </p>

                <div className="space-y-3">
                    {pageData.slice(0, 5).map((page, index) => (
                        <div
                            key={index}
                            className="bg-gray-50 dark:bg-gray-800 p-2 rounded-md"
                        >
                            <div className="text-sm font-medium truncate">
                                {page.path}
                            </div>
                            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                                <span>{page.uniqueVisitors} visitors</span>
                                <span>{page.eventCount} events</span>
                            </div>
                            <div className="mt-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                                    style={{
                                        width: `${
                                            (page.eventCount / maxEvents) * 100
                                        }%`,
                                    }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // Tab navigation
    const renderTabs = () => (
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-3">
            <button
                onClick={() => setActiveTab("summary")}
                className={`px-3 py-1.5 text-sm ${
                    activeTab === "summary"
                        ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400 font-medium"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300"
                }`}
            >
                Summary
            </button>
            <button
                onClick={() => setActiveTab("details")}
                className={`px-3 py-1.5 text-sm ${
                    activeTab === "details"
                        ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400 font-medium"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300"
                }`}
            >
                Details
            </button>
        </div>
    );

    // Render widget content based on active tab
    const renderContent = () => {
        if (activeTab === "summary") {
            return (
                <div className="p-2">
                    <p className="text-sm">{description}</p>
                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        Click on &quot;Details&quot; to see the full analysis
                    </div>
                </div>
            );
        }

        return renderInsightContent();
    };

    return (
        <BaseWidget
            config={config}
            domainId={domainId}
            events={events}
            isLoading={isLoading}
            onSettingsChange={onSettingsChange}
        >
            <div className="h-full overflow-hidden flex flex-col">
                {renderTabs()}
                <div className="flex-1 overflow-y-auto">{renderContent()}</div>
            </div>
        </BaseWidget>
    );
};

export default CorrelationInsightWidget;
