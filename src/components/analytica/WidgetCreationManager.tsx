import React, { useState, useMemo } from "react";
import { WidgetConfig, WidgetType, EventData } from "@/types/widgets";
import { createWidget } from "@/utils/widgetFactory";
import InsightsManager from "./InsightsManager";
import widgetRegistry from "@/utils/widgetRegistry";

interface WidgetCreationManagerProps {
    onAddWidget: (widget: WidgetConfig) => void;
    domainId: string;
    events: EventData[];
    isLoading: boolean;
    existingWidgetTypes?: Set<string>;
}

const WidgetCreationManager: React.FC<WidgetCreationManagerProps> = ({
    onAddWidget,
    domainId,
    events,
    isLoading,
    existingWidgetTypes = new Set(),
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<"widgets" | "insights">(
        "widgets"
    );

    // Get available widget templates from registry
    const widgetTemplates = useMemo(() => {
        const definitions = widgetRegistry.getAllDefinitions();
        return definitions.map((definition) => ({
            type: definition.type,
            title: definition.name,
            description: definition.description,
            icon: getIconForType(definition.icon),
            constraints: definition.constraints,
            isNew: definition.type === "traceback", // Mark traceback widget as new
        }));
    }, []);

    // Helper to render icon for widget types
    function getIconForType(iconName: string) {
        switch (iconName) {
            case "chart-pie":
                return (
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
                        />
                    </svg>
                );
            case "flow":
                return (
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M9 5l7 7-7 7"
                        />
                    </svg>
                );
            case "timeline":
                return (
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                    </svg>
                );
            case "home":
                return (
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        />
                    </svg>
                );
            case "traceback":
                return (
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                );
            default:
                return (
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                        />
                    </svg>
                );
        }
    }

    // Create a widget based on the selected type
    const createNewWidget = (type: WidgetType) => {
        const widgetConfig = createWidget(type, getDefaultTitle(type));
        onAddWidget(widgetConfig);
        setIsModalOpen(false);
    };

    // Get default title for widget type
    const getDefaultTitle = (type: WidgetType): string => {
        const definition = widgetRegistry.getDefinition(type);
        return definition?.name || capitalizeFirstLetter(type);
    };

    // Helper function to capitalize the first letter
    const capitalizeFirstLetter = (string: string): string => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    const handleAddInsightWidget = (widget: WidgetConfig) => {
        onAddWidget(widget);
        setIsModalOpen(false);
    };

    return (
        <div>
            {/* Widget Creation Button */}
            <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center justify-center rounded-full bg-blue-600 text-white w-10 h-10 shadow-lg"
                title="Add Widget"
            >
                <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                    />
                </svg>
            </button>

            {/* Widget Selection Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-[#23233a] rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold">
                                    Add Widget
                                </h3>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                >
                                    <svg
                                        className="w-5 h-5"
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

                            {/* Tab navigation */}
                            <div className="flex border-b border-gray-200 dark:border-gray-700 mt-4">
                                <button
                                    onClick={() => setActiveTab("widgets")}
                                    className={`px-4 py-2 text-sm font-medium ${
                                        activeTab === "widgets"
                                            ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                                            : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300"
                                    }`}
                                >
                                    Standard Widgets
                                </button>
                                <button
                                    onClick={() => setActiveTab("insights")}
                                    className={`px-4 py-2 text-sm font-medium ${
                                        activeTab === "insights"
                                            ? "border-b-2 border-purple-500 text-purple-600 dark:text-purple-400"
                                            : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300"
                                    }`}
                                >
                                    Data Insights
                                </button>
                            </div>
                        </div>

                        <div className="overflow-y-auto">
                            {activeTab === "widgets" ? (
                                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {widgetTemplates.map((template) => (
                                        <div
                                            key={template.type}
                                            className={`border ${
                                                template.isNew
                                                    ? "border-green-300 dark:border-green-700 shadow-sm"
                                                    : "border-gray-200 dark:border-gray-700"
                                            } rounded-lg p-4 cursor-pointer ${
                                                template.isNew
                                                    ? "hover:bg-green-50 dark:hover:bg-green-900/20"
                                                    : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                            } transition-colors`}
                                            onClick={() =>
                                                createNewWidget(template.type)
                                            }
                                        >
                                            <div className="flex items-start">
                                                <div
                                                    className={`${
                                                        template.isNew
                                                            ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                                                            : "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                                                    } rounded-lg p-2 mr-3`}
                                                >
                                                    {template.icon}
                                                </div>
                                                <div>
                                                    <div className="flex items-center">
                                                        <h4 className="font-medium">
                                                            {template.title}
                                                        </h4>
                                                        {template.isNew && (
                                                            <span className="ml-2 text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 px-2 py-0.5 rounded-full">
                                                                NEW
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                        {template.description}
                                                    </p>
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        Size:{" "}
                                                        {
                                                            template.constraints
                                                                .minWidth
                                                        }
                                                        x
                                                        {
                                                            template.constraints
                                                                .minHeight
                                                        }{" "}
                                                        to{" "}
                                                        {
                                                            template.constraints
                                                                .maxWidth
                                                        }
                                                        x
                                                        {
                                                            template.constraints
                                                                .maxHeight
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="insights-container max-h-[50vh]">
                                    <InsightsManager
                                        domainId={domainId}
                                        events={events}
                                        isLoading={isLoading}
                                        onAddWidget={handleAddInsightWidget}
                                        existingWidgetTypes={
                                            existingWidgetTypes
                                        }
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WidgetCreationManager;
