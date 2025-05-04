import React, { useState, ReactNode } from "react";
import { WidgetProps, WidgetSettings } from "@/types/widgets";
import { TimeFrame } from "@/components/EventTimelineChart";

interface BaseWidgetProps extends WidgetProps {
    children?: ReactNode;
}

const BaseWidget: React.FC<BaseWidgetProps> = ({
    config,
    isLoading,
    onSettingsChange,
    children,
}) => {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const handleSettingsChange = (newSettings: Partial<WidgetSettings>) => {
        onSettingsChange(config.id, { ...config.settings, ...newSettings });
        setIsSettingsOpen(false);
    };

    return (
        <div className="h-full w-full bg-white/70 dark:bg-[#23233a]/70 rounded-xl shadow-md border border-white/20 dark:border-white/5 overflow-hidden flex flex-col">
            {/* Widget Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-md font-semibold truncate">
                    {config.title}
                </h3>
                <div className="flex space-x-1">
                    {/* Settings button */}
                    <button
                        onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                        className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                        aria-label="Widget settings"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-gray-500 dark:text-gray-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Widget Content Area */}
            <div className="flex-grow p-3 overflow-auto relative">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="animate-pulse text-gray-500 dark:text-gray-400">
                            Loading...
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Settings Panel - Conditionally rendered */}
                        {isSettingsOpen && (
                            <div className="absolute inset-0 bg-white/95 dark:bg-[#23233a]/95 z-10 p-4 overflow-y-auto">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="font-medium">
                                        Widget Settings
                                    </h4>
                                    <button
                                        onClick={() => setIsSettingsOpen(false)}
                                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
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

                                {/* Default settings form - can be overridden by child widgets */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Time Frame
                                        </label>
                                        <select
                                            value={
                                                config.settings.timeFrame ||
                                                "24h"
                                            }
                                            onChange={(e) =>
                                                handleSettingsChange({
                                                    timeFrame: e.target
                                                        .value as TimeFrame,
                                                })
                                            }
                                            className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-sm"
                                        >
                                            <option value="1h">
                                                Last Hour
                                            </option>
                                            <option value="24h">
                                                Last 24 Hours
                                            </option>
                                            <option value="7d">
                                                Last 7 Days
                                            </option>
                                            <option value="30d">
                                                Last 30 Days
                                            </option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Refresh Interval (seconds)
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            step="10"
                                            value={
                                                config.settings
                                                    .refreshInterval || 0
                                            }
                                            onChange={(e) =>
                                                handleSettingsChange({
                                                    refreshInterval: parseInt(
                                                        e.target.value
                                                    ),
                                                })
                                            }
                                            className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-sm"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            0 means no auto-refresh
                                        </p>
                                    </div>

                                    <div className="pt-4 flex justify-end">
                                        <button
                                            onClick={() =>
                                                setIsSettingsOpen(false)
                                            }
                                            className="px-4 py-2 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 mr-2"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() =>
                                                setIsSettingsOpen(false)
                                            }
                                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                        >
                                            Apply
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Content provided by child widget */}
                        {children}
                    </>
                )}
            </div>
        </div>
    );
};

export default BaseWidget;
