import React, { useState, useEffect, useCallback } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import {
    DashboardConfig,
    WidgetConfig,
    WidgetSettings,
    EventData,
} from "@/types/widgets";
import { supabase } from "@/lib/supabase";
import { generateInsightWidgets, createWidget } from "@/utils/widgetFactory";

// Import widget components
import TimelineWidget from "./widgets/TimelineWidget";
import EventCountWidget from "./widgets/EventCountWidget";
import UniquePageWidget from "./widgets/UniquePageWidget";
import RecentEventsWidget from "./widgets/RecentEventsWidget";
import TopReferrersWidget from "./widgets/TopReferrersWidget";
import ConversionMetricsWidget from "./widgets/ConversionMetricsWidget";

// Create a responsive grid layout
const ResponsiveGridLayout = WidthProvider(Responsive);

const DEFAULT_LAYOUT = {
    columns: 4,
    rowHeight: 100,
    containerPadding: [10, 10] as [number, number],
    margin: [15, 15] as [number, number],
};

const DEFAULT_DASHBOARD: DashboardConfig = {
    id: "default",
    domainId: "",
    name: "Default Dashboard",
    layout: DEFAULT_LAYOUT,
    widgets: [],
    dateCreated: new Date().toISOString(),
    dateUpdated: new Date().toISOString(),
};

interface WidgetDashboardProps {
    domainId: string;
    events: EventData[];
    isLoading: boolean;
}

const WidgetDashboard: React.FC<WidgetDashboardProps> = ({
    domainId,
    events,
    isLoading,
}) => {
    const [dashboard, setDashboard] = useState<DashboardConfig | null>(null);
    const [isConfigMode, setIsConfigMode] = useState(false);
    const [isLoadingDashboard, setIsLoadingDashboard] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [suggestedWidgets, setSuggestedWidgets] = useState<WidgetConfig[]>(
        []
    );
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Create default widgets for a new dashboard
    const createDefaultWidgets = useCallback((): WidgetConfig[] => {
        return [
            createWidget(
                "timeline",
                "Event Timeline",
                { i: "timeline", x: 0, y: 0, w: 4, h: 2, minW: 2, minH: 2 },
                { timeFrame: "24h" }
            ),
            createWidget(
                "eventCount",
                "Total Events",
                { i: "event-count", x: 0, y: 2, w: 1, h: 1 },
                { timeFrame: "24h" }
            ),
            createWidget(
                "uniquePages",
                "Unique Pages",
                { i: "unique-pages", x: 1, y: 2, w: 1, h: 1 },
                { timeFrame: "24h" }
            ),
            createWidget(
                "recentEvents",
                "Recent Events",
                { i: "recent-events", x: 0, y: 3, w: 2, h: 2, minH: 2 },
                { maxItems: 5 }
            ),
        ];
    }, []);

    // Fetch dashboard configuration from domains table
    useEffect(() => {
        async function fetchDashboard() {
            try {
                setIsLoadingDashboard(true);

                // Try to fetch existing dashboard config from the domains table
                const { data, error } = await supabase
                    .from("domains")
                    .select("dashboard_config")
                    .eq("id", domainId)
                    .single();

                if (error) {
                    throw error;
                }

                if (data?.dashboard_config) {
                    setDashboard(data.dashboard_config);
                } else {
                    // Create a default dashboard if none exists
                    const defaultDashboard = {
                        ...DEFAULT_DASHBOARD,
                        domainId,
                        widgets: createDefaultWidgets(),
                    };

                    setDashboard(defaultDashboard);

                    // Save the default dashboard to the domains table
                    await supabase
                        .from("domains")
                        .update({ dashboard_config: defaultDashboard })
                        .eq("id", domainId);
                }
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "An unknown error occurred"
                );
                // Still use default dashboard on error
                setDashboard({
                    ...DEFAULT_DASHBOARD,
                    domainId,
                    widgets: createDefaultWidgets(),
                });
            } finally {
                setIsLoadingDashboard(false);
            }
        }

        if (domainId) {
            fetchDashboard();
        }
    }, [domainId, createDefaultWidgets]);

    // Generate insights when events change
    useEffect(() => {
        if (!isLoading && events.length > 0 && dashboard) {
            // Don't offer insights the user already has on their dashboard
            const existingWidgetTypes = new Set(
                dashboard.widgets.map((w) => w.type)
            );

            // Generate insight widgets
            const insights = generateInsightWidgets(events).filter(
                (widget) => !existingWidgetTypes.has(widget.type)
            );

            if (insights.length > 0) {
                setSuggestedWidgets(insights);
            }
        }
    }, [events, isLoading, dashboard]);

    // Save dashboard configuration to domains table
    const saveDashboard = async (updatedDashboard: DashboardConfig) => {
        try {
            const { error } = await supabase
                .from("domains")
                .update({ dashboard_config: updatedDashboard })
                .eq("id", domainId);

            if (error) throw error;
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to save dashboard"
            );
        }
    };

    // Handle layout changes
    const handleLayoutChange = (layouts: ReactGridLayout.Layout[]) => {
        if (!dashboard || !isConfigMode) return;

        // Update widget layouts
        const updatedWidgets = dashboard.widgets.map((widget) => {
            const newLayout = layouts.find((l) => l.i === widget.layout.i);
            if (newLayout) {
                return {
                    ...widget,
                    layout: {
                        ...widget.layout,
                        x: newLayout.x,
                        y: newLayout.y,
                        w: newLayout.w,
                        h: newLayout.h,
                    },
                };
            }
            return widget;
        });

        const updatedDashboard = {
            ...dashboard,
            widgets: updatedWidgets,
            dateUpdated: new Date().toISOString(),
        };

        setDashboard(updatedDashboard);
        saveDashboard(updatedDashboard);
    };

    // Handle widget settings changes
    const handleWidgetSettingsChange = (
        widgetId: string,
        newSettings: WidgetSettings
    ) => {
        if (!dashboard) return;

        const updatedWidgets = dashboard.widgets.map((widget) =>
            widget.id === widgetId
                ? {
                      ...widget,
                      settings: newSettings,
                      dateUpdated: new Date().toISOString(),
                  }
                : widget
        );

        const updatedDashboard = {
            ...dashboard,
            widgets: updatedWidgets,
            dateUpdated: new Date().toISOString(),
        };

        setDashboard(updatedDashboard);
        saveDashboard(updatedDashboard);
    };

    // Add a widget to dashboard
    const addWidget = (widget: WidgetConfig) => {
        if (!dashboard) return;

        // Find the best position for the new widget
        let maxY = 0;
        dashboard.widgets.forEach((w) => {
            const bottomY = w.layout.y + w.layout.h;
            if (bottomY > maxY) maxY = bottomY;
        });

        // Place the widget at the bottom of the dashboard
        const widgetWithPosition = {
            ...widget,
            layout: {
                ...widget.layout,
                y: maxY + 1, // Add some spacing
            },
        };

        const updatedDashboard = {
            ...dashboard,
            widgets: [...dashboard.widgets, widgetWithPosition],
            dateUpdated: new Date().toISOString(),
        };

        setDashboard(updatedDashboard);
        saveDashboard(updatedDashboard);

        // Remove from suggestions
        setSuggestedWidgets((current) =>
            current.filter((w) => w.id !== widget.id)
        );
    };

    // Remove a widget from dashboard
    const removeWidget = (widgetId: string) => {
        if (!dashboard) return;

        const updatedDashboard = {
            ...dashboard,
            widgets: dashboard.widgets.filter((w) => w.id !== widgetId),
            dateUpdated: new Date().toISOString(),
        };

        setDashboard(updatedDashboard);
        saveDashboard(updatedDashboard);
    };

    // Render appropriate widget by type
    const renderWidget = (widgetConfig: WidgetConfig) => {
        const props = {
            config: widgetConfig,
            domainId,
            events,
            isLoading: isLoading || isLoadingDashboard,
            onSettingsChange: handleWidgetSettingsChange,
        };

        switch (widgetConfig.type) {
            case "timeline":
                return <TimelineWidget key={widgetConfig.id} {...props} />;
            case "eventCount":
                return <EventCountWidget key={widgetConfig.id} {...props} />;
            case "uniquePages":
                return <UniquePageWidget key={widgetConfig.id} {...props} />;
            case "recentEvents":
                return <RecentEventsWidget key={widgetConfig.id} {...props} />;
            case "topReferrers":
                return <TopReferrersWidget key={widgetConfig.id} {...props} />;
            case "conversionMetrics":
                return (
                    <ConversionMetricsWidget key={widgetConfig.id} {...props} />
                );
            default:
                return (
                    <div
                        key={widgetConfig.id}
                        className="h-full w-full bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center"
                    >
                        Unknown widget type: {widgetConfig.type}
                    </div>
                );
        }
    };

    if (!dashboard) {
        return (
            <div className="flex justify-center items-center h-64 bg-white/70 dark:bg-[#23233a]/70 rounded-xl shadow-lg p-8 border border-white/20 dark:border-white/5">
                <div className="animate-pulse text-gray-500 dark:text-gray-400">
                    Loading dashboard...
                </div>
            </div>
        );
    }

    // Get layouts for responsive grid
    const layouts = {
        lg: dashboard.widgets.map((w) => ({
            ...w.layout,
            static: !isConfigMode,
        })),
    };

    return (
        <div className="bg-white/70 dark:bg-[#23233a]/70 rounded-xl shadow-lg p-8 border border-white/20 dark:border-white/5 w-full">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Dashboard</h2>
                <div className="flex space-x-2">
                    {suggestedWidgets.length > 0 && (
                        <button
                            onClick={() => setShowSuggestions(!showSuggestions)}
                            className="px-4 py-2 rounded-lg bg-purple-600 text-white"
                        >
                            Insights ({suggestedWidgets.length})
                        </button>
                    )}
                    <button
                        onClick={() => setIsConfigMode(!isConfigMode)}
                        className={`px-4 py-2 rounded-lg ${
                            isConfigMode
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
                        }`}
                    >
                        {isConfigMode ? "Done" : "Configure"}
                    </button>
                </div>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
                    {error}
                </div>
            )}

            {isConfigMode && (
                <div className="mb-4 p-3 bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <p className="text-blue-800 dark:text-blue-300 text-sm">
                        <strong>Configuration Mode:</strong> Drag and resize
                        widgets to customize your dashboard.
                    </p>
                </div>
            )}

            {/* Widget Suggestions Panel */}
            {showSuggestions && suggestedWidgets.length > 0 && (
                <div className="mb-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800 p-4">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-md font-semibold text-purple-800 dark:text-purple-300">
                            Insights Based on Your Data
                        </h3>
                        <button
                            onClick={() => setShowSuggestions(false)}
                            className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {suggestedWidgets.map((widget) => (
                            <div
                                key={widget.id}
                                className="bg-white dark:bg-[#212134] rounded-lg shadow-sm border border-purple-100 dark:border-purple-800 p-3 flex flex-col"
                            >
                                <div className="font-medium mb-1">
                                    {widget.title}
                                </div>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                                    We detected patterns that might be valuable
                                    to visualize.
                                </p>
                                <div className="mt-auto flex justify-end space-x-2">
                                    <button
                                        onClick={() =>
                                            setSuggestedWidgets((current) =>
                                                current.filter(
                                                    (w) => w.id !== widget.id
                                                )
                                            )
                                        }
                                        className="px-3 py-1 text-sm rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                                    >
                                        Dismiss
                                    </button>
                                    <button
                                        onClick={() => addWidget(widget)}
                                        className="px-3 py-1 text-sm rounded-md bg-purple-600 hover:bg-purple-700 text-white"
                                    >
                                        Add to Dashboard
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <ResponsiveGridLayout
                className="layout"
                layouts={layouts}
                breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                cols={{ lg: 4, md: 4, sm: 3, xs: 2, xxs: 2 }}
                rowHeight={dashboard.layout.rowHeight}
                containerPadding={dashboard.layout.containerPadding}
                margin={dashboard.layout.margin}
                onLayoutChange={handleLayoutChange}
                isDraggable={isConfigMode}
                isResizable={isConfigMode}
                useCSSTransforms={true}
            >
                {dashboard.widgets.map((widget) => (
                    <div key={widget.layout.i} style={{ overflow: "hidden" }}>
                        {isConfigMode && (
                            <div className="absolute top-0 right-0 z-10 p-1">
                                <button
                                    onClick={() => removeWidget(widget.id)}
                                    className="bg-red-600 text-white p-1 rounded-md hover:bg-red-700"
                                    title="Remove widget"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>
                            </div>
                        )}
                        {renderWidget(widget)}
                    </div>
                ))}
            </ResponsiveGridLayout>
        </div>
    );
};

export default WidgetDashboard;
