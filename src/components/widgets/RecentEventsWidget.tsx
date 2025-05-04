import React, { useMemo, useState } from "react";
import { WidgetProps } from "@/types/widgets";
import BaseWidget from "./BaseWidget";

const RecentEventsWidget: React.FC<WidgetProps> = (props) => {
    const { config, events } = props;
    const [selectedEvent, setSelectedEvent] = useState<number | null>(null);

    // Get max items to display
    const maxItems = (config.settings.maxItems as number) || 5;

    // Get recent events
    const recentEvents = useMemo(() => {
        return [...events]
            .sort(
                (a, b) =>
                    new Date(b.created_at).getTime() -
                    new Date(a.created_at).getTime()
            )
            .slice(0, maxItems);
    }, [events, maxItems]);

    return (
        <BaseWidget {...props}>
            <div className="h-full overflow-auto">
                {recentEvents.length === 0 ? (
                    <div className="flex h-full items-center justify-center">
                        <p className="text-gray-500 dark:text-gray-400">
                            No events recorded yet
                        </p>
                    </div>
                ) : (
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead>
                            <tr>
                                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Time
                                </th>
                                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Type
                                </th>
                                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Path
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white/50 dark:bg-[#212134]/50 divide-y divide-gray-200 dark:divide-gray-800">
                            {recentEvents.map((event, index) => (
                                <tr
                                    key={event.id}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer"
                                    onClick={() =>
                                        setSelectedEvent(
                                            selectedEvent === index
                                                ? null
                                                : index
                                        )
                                    }
                                >
                                    <td className="px-2 py-2 text-xs text-gray-700 dark:text-gray-300 whitespace-nowrap">
                                        {new Date(
                                            event.created_at
                                        ).toLocaleTimeString()}
                                    </td>
                                    <td className="px-2 py-2 text-xs text-gray-700 dark:text-gray-300 whitespace-nowrap">
                                        {event.type}
                                    </td>
                                    <td className="px-2 py-2 text-xs text-gray-700 dark:text-gray-300 max-w-[120px] truncate">
                                        {event.payload?.path || "-"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {/* Event Detail View */}
                {selectedEvent !== null && recentEvents[selectedEvent] && (
                    <div
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                        onClick={() => setSelectedEvent(null)}
                    >
                        <div
                            className="bg-white dark:bg-[#23233a] rounded-lg shadow-xl p-4 max-w-xl w-full mx-4 max-h-[80vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="text-lg font-semibold">
                                    Event Details
                                </h3>
                                <button
                                    onClick={() => setSelectedEvent(null)}
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

                            <div className="text-sm">
                                <div className="mb-2">
                                    <span className="font-medium text-gray-700 dark:text-gray-300">
                                        Type:
                                    </span>{" "}
                                    <span>
                                        {recentEvents[selectedEvent].type}
                                    </span>
                                </div>
                                <div className="mb-2">
                                    <span className="font-medium text-gray-700 dark:text-gray-300">
                                        Time:
                                    </span>{" "}
                                    <span>
                                        {new Date(
                                            recentEvents[
                                                selectedEvent
                                            ].created_at
                                        ).toLocaleString()}
                                    </span>
                                </div>
                                {recentEvents[selectedEvent].payload?.path && (
                                    <div className="mb-2">
                                        <span className="font-medium text-gray-700 dark:text-gray-300">
                                            Path:
                                        </span>{" "}
                                        <span className="break-words">
                                            {
                                                recentEvents[selectedEvent]
                                                    .payload.path
                                            }
                                        </span>
                                    </div>
                                )}
                                {recentEvents[selectedEvent].payload
                                    ?.referrer && (
                                    <div className="mb-2">
                                        <span className="font-medium text-gray-700 dark:text-gray-300">
                                            Referrer:
                                        </span>{" "}
                                        <span className="break-words">
                                            {
                                                recentEvents[selectedEvent]
                                                    .payload.referrer
                                            }
                                        </span>
                                    </div>
                                )}

                                <div className="mt-4">
                                    <div className="font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Payload:
                                    </div>
                                    <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs overflow-x-auto">
                                        {JSON.stringify(
                                            recentEvents[selectedEvent].payload,
                                            null,
                                            2
                                        )}
                                    </pre>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </BaseWidget>
    );
};

export default RecentEventsWidget;
