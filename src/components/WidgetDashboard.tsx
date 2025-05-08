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
import { createWidget } from "@/utils/widgetFactory";
import { registerAllWidgets } from "@/utils";
import widgetRegistry from "@/utils/widgetRegistry";

// Import widget components
import TimelineWidget from "./widgets/TimelineWidget";
import EventCountWidget from "./widgets/EventCountWidget";
import UniquePageWidget from "./widgets/UniquePageWidget";
import RecentEventsWidget from "./widgets/RecentEventsWidget";
import TopReferrersWidget from "./widgets/TopReferrersWidget";
import ConversionMetricsWidget from "./widgets/ConversionMetricsWidget";
import CorrelationInsightWidget from "./widgets/CorrelationInsightWidget";
import UserFlowWidget from "./widgets/UserFlowWidget";
import TracebackWidget from "./widgets/TracebackWidget";
import WidgetCreationManager from "./WidgetCreationManager";

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
    const [tempDashboard, setTempDashboard] = useState<DashboardConfig | null>(
        null
    );
    const [isConfigMode, setIsConfigMode] = useState(false);
    const [isLoadingDashboard, setIsLoadingDashboard] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentColumns, setCurrentColumns] = useState<number>(4);
    const [showWarning, setShowWarning] = useState(false);
    const [showResetConfirmation, setShowResetConfirmation] = useState(false);

    // Reset dashboard state when domainId changes
    useEffect(() => {
        setDashboard(null);
        setTempDashboard(null);
        setIsConfigMode(false);
        setError(null);
        setIsLoadingDashboard(true);
    }, [domainId]);

    // Create default widgets for a new dashboard
    const createDefaultWidgets = useCallback((): WidgetConfig[] => {
        return [
            createWidget(
                "timeline",
                "Event Timeline",
                { i: "timeline", x: 0, y: 0, w: 4, h: 4, minW: 2, minH: 2 },
                { timeFrame: "24h" }
            ),
            createWidget(
                "eventCount",
                "Total Events",
                { i: "event-count", x: 0, y: 4, w: 1, h: 2 },
                { timeFrame: "24h" }
            ),
            createWidget(
                "uniquePages",
                "Unique Pages",
                { i: "unique-pages", x: 1, y: 4, w: 1, h: 2 },
                { timeFrame: "24h" }
            ),
            createWidget(
                "recentEvents",
                "Recent Events",
                { i: "recent-events", x: 2, y: 4, w: 2, h: 2, minH: 2 },
                { maxItems: 5 }
            ),
        ];
    }, []);

    // Apply widget constraints from registry
    const applyWidgetConstraints = (
        widgets: WidgetConfig[]
    ): WidgetConfig[] => {
        return widgets.map((widget) => {
            const constraints = widgetRegistry.getConstraints(widget.type);

            return {
                ...widget,
                layout: {
                    ...widget.layout,
                    // Always apply constraints from registry, not from saved config
                    minW: constraints?.minWidth,
                    maxW: constraints?.maxWidth,
                    minH: constraints?.minHeight,
                    maxH: constraints?.maxHeight,
                },
            };
        });
    };

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
                    // Apply constraints from registry to loaded widgets
                    const updatedDashboard = {
                        ...data.dashboard_config,
                        widgets: applyWidgetConstraints(
                            data.dashboard_config.widgets
                        ),
                    };
                    setDashboard(updatedDashboard);
                } else {
                    // Create a default dashboard if none exists
                    const defaultWidgets = createDefaultWidgets();
                    const defaultDashboard = {
                        ...DEFAULT_DASHBOARD,
                        domainId,
                        widgets: applyWidgetConstraints(defaultWidgets),
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
                const defaultWidgets = createDefaultWidgets();
                setDashboard({
                    ...DEFAULT_DASHBOARD,
                    domainId,
                    widgets: applyWidgetConstraints(defaultWidgets),
                });
            } finally {
                setIsLoadingDashboard(false);
            }
        }

        if (domainId) {
            fetchDashboard();
        }
    }, [domainId, createDefaultWidgets]);

    // Save dashboard configuration to domains table
    const saveDashboard = async (updatedDashboard: DashboardConfig) => {
        try {
            // Strip out min/max constraints before saving to Supabase
            const dashboardToSave = {
                ...updatedDashboard,
                widgets: updatedDashboard.widgets.map((widget) => ({
                    ...widget,
                    layout: {
                        ...widget.layout,
                        // Remove constraint properties
                        minW: undefined,
                        maxW: undefined,
                        minH: undefined,
                        maxH: undefined,
                    },
                })),
            };

            const { error } = await supabase
                .from("domains")
                .update({ dashboard_config: dashboardToSave })
                .eq("id", domainId);

            if (error) throw error;
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to save dashboard"
            );
        }
    };

    // Handle layout changes - store temporarily without saving
    const handleLayoutChange = (layouts: ReactGridLayout.Layout[]) => {
        if (!dashboard || !tempDashboard || !isConfigMode) return;

        // Update widget layouts in the temporary dashboard
        const updatedWidgets = tempDashboard.widgets.map((widget) => {
            const newLayout = layouts.find((l) => l.i === widget.layout.i);
            if (newLayout) {
                const constraints = widgetRegistry.getConstraints(widget.type);

                return {
                    ...widget,
                    layout: {
                        ...widget.layout,
                        x: newLayout.x,
                        y: newLayout.y,
                        w: newLayout.w,
                        h: newLayout.h,
                        // Always apply constraints from registry
                        minW: constraints?.minWidth,
                        maxW: constraints?.maxWidth,
                        minH: constraints?.minHeight,
                        maxH: constraints?.maxHeight,
                    },
                };
            }
            return widget;
        });

        const updatedTempDashboard = {
            ...tempDashboard,
            widgets: updatedWidgets,
            dateUpdated: new Date().toISOString(),
        };

        setTempDashboard(updatedTempDashboard);
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

        // Get constraints from registry for the widget type
        const constraints = widgetRegistry.getConstraints(widget.type);

        // Apply constraints from registry (overriding any existing constraints)
        const widgetWithPosition = {
            ...widget,
            layout: {
                ...widget.layout,
                y: maxY + 1, // Add some spacing
                minW: constraints?.minWidth,
                maxW: constraints?.maxWidth,
                minH: constraints?.minHeight,
                maxH: constraints?.maxHeight,
            },
        };

        const updatedDashboard = {
            ...dashboard,
            widgets: [...dashboard.widgets, widgetWithPosition],
            dateUpdated: new Date().toISOString(),
        };

        setDashboard(updatedDashboard);
        saveDashboard(updatedDashboard);
    };

    // Remove a widget from dashboard
    const removeWidget = (
        widgetId: string,
        e: React.MouseEvent<HTMLButtonElement>
    ) => {
        // Stop propagation to prevent drag
        e.stopPropagation();

        if (!tempDashboard || !isConfigMode) return;

        const updatedTempDashboard = {
            ...tempDashboard,
            widgets: tempDashboard.widgets.filter((w) => w.id !== widgetId),
        };

        setTempDashboard(updatedTempDashboard);
    };

    // Handle entering configuration mode
    const enterConfigMode = () => {
        if (currentColumns < 4) {
            setShowWarning(true);
            return;
        }

        if (dashboard) {
            // Create a temporary copy of the dashboard for editing
            setTempDashboard(JSON.parse(JSON.stringify(dashboard)));
            setIsConfigMode(true);
        }
    };

    // Handle saving configuration changes
    const saveConfigChanges = () => {
        if (!tempDashboard) return;

        const updatedDashboard = {
            ...tempDashboard,
            dateUpdated: new Date().toISOString(),
        };

        setDashboard(updatedDashboard);
        saveDashboard(updatedDashboard);
        setIsConfigMode(false);
        setTempDashboard(null);
    };

    // Handle canceling configuration changes
    const cancelConfigChanges = () => {
        setIsConfigMode(false);
        setTempDashboard(null);
    };

    // Reset dashboard to default
    const resetDashboard = async () => {
        if (!domainId) return;

        // Create a default dashboard with constraints from registry
        const defaultWidgets = createDefaultWidgets();
        const defaultDashboard = {
            ...DEFAULT_DASHBOARD,
            domainId,
            widgets: applyWidgetConstraints(defaultWidgets),
            dateUpdated: new Date().toISOString(),
        };

        setDashboard(defaultDashboard);
        setShowResetConfirmation(false);

        // Save the default dashboard to the domains table
        try {
            await supabase
                .from("domains")
                .update({ dashboard_config: defaultDashboard })
                .eq("id", domainId);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to save reset dashboard"
            );
        }
    };

    // Handle width changes and update column count
    const handleWidthChange = (
        width: number,
        margin: [number, number],
        cols: number
    ) => {
        setCurrentColumns(cols);
    };

    // Get existing widget types for filtering insights
    const getExistingWidgetTypes = (): Set<string> => {
        if (!dashboard) return new Set();
        return new Set(dashboard.widgets.map((w) => w.type));
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
            case "customInsight":
                return (
                    <CorrelationInsightWidget
                        key={widgetConfig.id}
                        {...props}
                    />
                );
            case "userFlow":
                return <UserFlowWidget key={widgetConfig.id} {...props} />;
            case "traceback":
                return <TracebackWidget key={widgetConfig.id} {...props} />;
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

    // Initialize widgets on component mount
    useEffect(() => {
        // Register all widgets
        registerAllWidgets();
    }, []);

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
        lg: (isConfigMode && tempDashboard
            ? tempDashboard
            : dashboard
        ).widgets.map((w) => ({
            ...w.layout,
            static: !isConfigMode,
        })),
    };

    return (
        <div className="bg-white/70 dark:bg-[#23233a]/70 rounded-xl shadow-lg p-8 border border-white/20 dark:border-white/5 w-full">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Dashboard</h2>
                <div className="flex space-x-2 items-center">
                    {!isConfigMode && !isLoadingDashboard && (
                        <WidgetCreationManager
                            onAddWidget={addWidget}
                            domainId={domainId}
                            events={events}
                            isLoading={isLoading}
                            existingWidgetTypes={getExistingWidgetTypes()}
                        />
                    )}
                    {isConfigMode ? (
                        <>
                            <button
                                onClick={cancelConfigChanges}
                                className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveConfigChanges}
                                className="px-4 py-2 rounded-lg bg-blue-600 text-white"
                            >
                                Save
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => setShowResetConfirmation(true)}
                                className="px-4 py-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800/50"
                            >
                                Reset
                            </button>
                            <button
                                onClick={enterConfigMode}
                                className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
                            >
                                Configure
                            </button>
                        </>
                    )}
                </div>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
                    {error}
                </div>
            )}

            {showWarning && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-[#23233a] p-6 rounded-lg max-w-md">
                        <h3 className="text-lg font-semibold mb-3">
                            Screen Size Warning
                        </h3>
                        <p className="mb-4 text-gray-700 dark:text-gray-300">
                            Dashboard configuration is only available in full
                            view (4 columns). Please expand your browser window
                            or switch to a larger device.
                        </p>
                        <div className="flex justify-end">
                            <button
                                onClick={() => setShowWarning(false)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                            >
                                Got it
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showResetConfirmation && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-[#23233a] p-6 rounded-lg max-w-md">
                        <h3 className="text-lg font-semibold mb-3">
                            Reset Dashboard
                        </h3>
                        <p className="mb-4 text-gray-700 dark:text-gray-300">
                            Are you sure you want to reset the dashboard to its
                            default configuration? This will remove all custom
                            widgets and layouts.
                        </p>
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => setShowResetConfirmation(false)}
                                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={resetDashboard}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg"
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isConfigMode && (
                <div className="mb-4 p-3 bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <p className="text-blue-800 dark:text-blue-300 text-sm">
                        <strong>Configuration Mode:</strong> Drag and resize
                        widgets to customize your dashboard. Click Save to apply
                        changes.
                    </p>
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
                onWidthChange={handleWidthChange}
                isDraggable={isConfigMode}
                isResizable={isConfigMode}
                useCSSTransforms={true}
            >
                {(isConfigMode && tempDashboard
                    ? tempDashboard
                    : dashboard
                ).widgets.map((widget) => (
                    <div key={widget.layout.i} style={{ overflow: "hidden" }}>
                        {isConfigMode && (
                            <div className="absolute top-0 right-0 z-10 p-1">
                                <button
                                    onMouseDown={(e) => e.stopPropagation()}
                                    onTouchStart={(e) => e.stopPropagation()}
                                    onClick={(e) => removeWidget(widget.id, e)}
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
