import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { WidgetConfig, EventData } from "@/types/widgets";
import { generateInsightWidgets, analyzeCorrelations } from "@/utils";

interface InsightsManagerProps {
    domainId: string;
    events: EventData[];
    isLoading: boolean;
    onAddWidget: (widget: WidgetConfig) => void;
    existingWidgetTypes?: Set<string>;
}

const InsightsManager: React.FC<InsightsManagerProps> = ({
    domainId,
    events,
    isLoading,
    onAddWidget,
    existingWidgetTypes = new Set(),
}) => {
    const [activeInsights, setActiveInsights] = useState<WidgetConfig[]>([]);
    const [archivedInsights, setArchivedInsights] = useState<WidgetConfig[]>(
        []
    );
    const [showArchived, setShowArchived] = useState(false);
    const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);

    // Load archived insights from the database
    useEffect(() => {
        if (!domainId) return;

        async function loadArchivedInsights() {
            try {
                const { data, error } = await supabase
                    .from("archived_insights")
                    .select("*")
                    .eq("domain_id", domainId);

                if (error) throw error;
                setArchivedInsights(data || []);
            } catch (error) {
                console.error("Error loading archived insights:", error);
            }
        }

        loadArchivedInsights();
    }, [domainId]);

    // Generate insights when events change
    useEffect(() => {
        if (isLoading || events.length === 0 || !domainId) return;

        async function generateInsights() {
            setIsGeneratingInsights(true);
            try {
                // Generate basic insights
                const basicInsights = generateInsightWidgets(events).filter(
                    (widget) => !existingWidgetTypes.has(widget.type)
                );

                // Generate correlation-based insights (more advanced)
                const correlationInsights = analyzeCorrelations(events).filter(
                    (widget) => !existingWidgetTypes.has(widget.type)
                );

                // Combine all insights
                const allInsights = [...basicInsights, ...correlationInsights];

                // Filter out any insights that are already in the archived list
                const archivedIds = new Set(
                    archivedInsights.map((insight) => insight.id)
                );
                const filteredInsights = allInsights.filter(
                    (insight) => !archivedIds.has(insight.id)
                );

                setActiveInsights(filteredInsights);
            } catch (error) {
                console.error("Error generating insights:", error);
            } finally {
                setIsGeneratingInsights(false);
            }
        }

        generateInsights();
    }, [events, isLoading, domainId, existingWidgetTypes, archivedInsights]);

    // Archive an insight
    const archiveInsight = async (widgetId: string) => {
        const insightToArchive = activeInsights.find((w) => w.id === widgetId);
        if (!insightToArchive) return;

        try {
            // Add to archived_insights table
            const { error } = await supabase.from("archived_insights").insert({
                domain_id: domainId,
                widget_config: {
                    ...insightToArchive,
                    isArchived: true,
                },
            });

            if (error) throw error;

            // Update local state
            setArchivedInsights([
                ...archivedInsights,
                { ...insightToArchive, isArchived: true },
            ]);
            setActiveInsights(activeInsights.filter((w) => w.id !== widgetId));
        } catch (error) {
            console.error("Error archiving insight:", error);
        }
    };

    // Unarchive an insight
    const unarchiveInsight = async (widgetId: string) => {
        const insightToUnarchive = archivedInsights.find(
            (w) => w.id === widgetId
        );
        if (!insightToUnarchive) return;

        try {
            // Remove from archived_insights table
            const { error } = await supabase
                .from("archived_insights")
                .delete()
                .eq("widget_config.id", widgetId);

            if (error) throw error;

            // Update local state
            const updatedInsight = { ...insightToUnarchive, isArchived: false };
            setActiveInsights([...activeInsights, updatedInsight]);
            setArchivedInsights(
                archivedInsights.filter((w) => w.id !== widgetId)
            );
        } catch (error) {
            console.error("Error unarchiving insight:", error);
        }
    };

    // Add widget to dashboard
    const handleAddWidget = (widget: WidgetConfig) => {
        onAddWidget(widget);
        // Remove from active insights
        setActiveInsights(activeInsights.filter((w) => w.id !== widget.id));
    };

    if (isLoading || isGeneratingInsights) {
        return (
            <div className="p-6 animate-pulse">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-3"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
            </div>
        );
    }

    // Don't render anything if no insights available (active or archived)
    if (activeInsights.length === 0 && archivedInsights.length === 0) {
        return (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                No insights available based on current data.
            </div>
        );
    }

    // Don't render if there are no active insights and we're not showing archived
    if (activeInsights.length === 0 && !showArchived) {
        return (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                No new insights available right now.
                {archivedInsights.length > 0 && (
                    <div className="mt-2">
                        <button
                            onClick={() => setShowArchived(true)}
                            className="text-sm px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                        >
                            View Archived Insights ({archivedInsights.length})
                        </button>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-md font-semibold">
                    {showArchived
                        ? "Archived Insights"
                        : "Insights Based on Your Data"}
                </h3>
                <div className="flex space-x-2">
                    {archivedInsights.length > 0 && (
                        <button
                            onClick={() => setShowArchived(!showArchived)}
                            className="text-sm px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                        >
                            {showArchived
                                ? "Show Active"
                                : `Archive (${archivedInsights.length})`}
                        </button>
                    )}
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {showArchived ? (
                    archivedInsights.length > 0 ? (
                        archivedInsights.map((widget) => (
                            <div
                                key={widget.id}
                                className="bg-white dark:bg-[#212134] rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3 flex flex-col"
                            >
                                <div className="font-medium mb-1">
                                    {widget.title}
                                </div>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                                    This insight was previously archived.
                                </p>
                                <div className="mt-auto flex justify-end space-x-2">
                                    <button
                                        onClick={() =>
                                            unarchiveInsight(widget.id)
                                        }
                                        className="px-3 py-1 text-sm rounded-md bg-purple-600 hover:bg-purple-700 text-white"
                                    >
                                        Restore
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-4 text-gray-500 dark:text-gray-400">
                            No archived insights
                        </div>
                    )
                ) : (
                    activeInsights.map((widget) => (
                        <div
                            key={widget.id}
                            className="bg-white dark:bg-[#212134] rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3 flex flex-col"
                        >
                            <div className="font-medium mb-1">
                                {widget.title}
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                                We detected patterns that might be valuable to
                                visualize.
                            </p>
                            <div className="mt-auto flex justify-end space-x-2">
                                <button
                                    onClick={() => archiveInsight(widget.id)}
                                    className="px-3 py-1 text-sm rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                                >
                                    Archive
                                </button>
                                <button
                                    onClick={() => handleAddWidget(widget)}
                                    className="px-3 py-1 text-sm rounded-md bg-purple-600 hover:bg-purple-700 text-white"
                                >
                                    Add to Dashboard
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default InsightsManager;
