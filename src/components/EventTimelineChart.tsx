import React, { useState, useEffect } from "react";
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    AreaChart,
} from "recharts";

export type TimeFrame = "1h" | "24h" | "7d" | "30d";

export type EventData = {
    id: string;
    domain_id?: string;
    type?: string;
    payload?: {
        path?: string;
        referrer?: string;
        title?: string;
        [key: string]: string | number | boolean | null | undefined;
    } | null;
    created_at: string;
    [key: string]: string | number | boolean | null | undefined | object; // Use object for complex nested properties
};

export type EventsChartData = {
    date: string;
    formattedTime: string;
    count: number;
};

interface EventTimelineChartProps {
    events: EventData[];
    timeFrame?: TimeFrame;
    onTimeFrameChange?: (timeFrame: TimeFrame) => void;
    isLoading?: boolean;
}

export default function EventTimelineChart({
    events,
    timeFrame = "24h",
    onTimeFrameChange,
    isLoading = false,
}: EventTimelineChartProps) {
    const [chartData, setChartData] = useState<EventsChartData[]>([]);
    const [localTimeFrame, setLocalTimeFrame] = useState<TimeFrame>(timeFrame);

    // Handle time frame changes locally if no external handler is provided
    const handleTimeFrameChange = (newTimeFrame: TimeFrame) => {
        if (onTimeFrameChange) {
            onTimeFrameChange(newTimeFrame);
        } else {
            setLocalTimeFrame(newTimeFrame);
        }
    };

    // Process events data for chart visualization based on selected timeframe
    useEffect(() => {
        if (events.length === 0) {
            setChartData([]);
            return;
        }

        const activeTimeFrame = onTimeFrameChange ? timeFrame : localTimeFrame;

        // Filter events based on timeframe
        const now = new Date();
        const startTime = new Date(now);

        switch (activeTimeFrame) {
            case "1h":
                startTime.setHours(now.getHours() - 1);
                break;
            case "24h":
                startTime.setDate(now.getDate() - 1);
                break;
            case "7d":
                startTime.setDate(now.getDate() - 7);
                break;
            case "30d":
                startTime.setDate(now.getDate() - 30);
                break;
        }

        const filteredEvents = events.filter(
            (event) => new Date(event.created_at) >= startTime
        );

        // Determine time grouping format based on timeframe
        let format: "minute" | "hour" | "day" = "day";

        if (activeTimeFrame === "1h") {
            format = "minute";
        } else if (activeTimeFrame === "24h") {
            format = "hour";
        } else {
            format = "day";
        }

        // Group events by the determined time format
        const eventsByTime: Record<string, number> = {};

        // Create empty time slots for continuous display
        const timeSlots: string[] = [];
        if (format === "minute") {
            for (let i = 0; i < 60; i++) {
                const date = new Date(startTime);
                date.setMinutes(startTime.getMinutes() + i);
                const timeKey = date.toISOString();
                timeSlots.push(timeKey);
                eventsByTime[timeKey] = 0;
            }
        } else if (format === "hour") {
            for (let i = 0; i < 24; i++) {
                const date = new Date(startTime);
                date.setHours(startTime.getHours() + i);
                const timeKey = date.toISOString();
                timeSlots.push(timeKey);
                eventsByTime[timeKey] = 0;
            }
        } else {
            const days = activeTimeFrame === "7d" ? 7 : 30;
            for (let i = 0; i < days; i++) {
                const date = new Date(startTime);
                date.setDate(startTime.getDate() + i);
                const timeKey = date.toISOString().split("T")[0];
                timeSlots.push(timeKey);
                eventsByTime[timeKey] = 0;
            }
        }

        // Count events for each time slot
        filteredEvents.forEach((event) => {
            const date = new Date(event.created_at);
            let timeKey: string;

            if (format === "minute") {
                date.setSeconds(0, 0);
                timeKey = date.toISOString();
            } else if (format === "hour") {
                date.setMinutes(0, 0, 0);
                timeKey = date.toISOString();
            } else {
                timeKey = date.toISOString().split("T")[0];
            }

            eventsByTime[timeKey] = (eventsByTime[timeKey] || 0) + 1;
        });

        // Convert to array and format for chart
        const data = Object.entries(eventsByTime)
            .map(([timeKey, count]) => {
                const date = new Date(timeKey);
                let formattedTime: string;

                if (format === "minute") {
                    formattedTime = `${date
                        .getHours()
                        .toString()
                        .padStart(2, "0")}:${date
                        .getMinutes()
                        .toString()
                        .padStart(2, "0")}`;
                } else if (format === "hour") {
                    formattedTime = `${date
                        .getHours()
                        .toString()
                        .padStart(2, "0")}:00`;
                } else {
                    formattedTime = `${(date.getMonth() + 1)
                        .toString()
                        .padStart(2, "0")}/${date
                        .getDate()
                        .toString()
                        .padStart(2, "0")}`;
                }

                return {
                    date: timeKey,
                    formattedTime,
                    count,
                };
            })
            .sort((a, b) => a.date.localeCompare(b.date));

        setChartData(data);
    }, [events, timeFrame, localTimeFrame, onTimeFrameChange]);

    return (
        <div className="p-4 bg-white/40 dark:bg-[#212134]/40 rounded-lg border border-gray-200 dark:border-gray-800">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Event Timeline</h3>
                <div className="flex space-x-2">
                    <select
                        value={onTimeFrameChange ? timeFrame : localTimeFrame}
                        onChange={(e) =>
                            handleTimeFrameChange(e.target.value as TimeFrame)
                        }
                        className="px-3 py-1 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="1h">Last Hour</option>
                        <option value="24h">Last 24 Hours</option>
                        <option value="7d">Last 7 Days</option>
                        <option value="30d">Last 30 Days</option>
                    </select>
                </div>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 flex items-center justify-center min-h-[200px]">
                {isLoading ? (
                    <p className="text-gray-500 dark:text-gray-400">
                        Loading data...
                    </p>
                ) : chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart
                            data={chartData}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <defs>
                                <linearGradient
                                    id="colorCount"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="5%"
                                        stopColor="#3b82f6"
                                        stopOpacity={0.8}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor="#3b82f6"
                                        stopOpacity={0.1}
                                    />
                                </linearGradient>
                            </defs>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#9ca3af30"
                            />
                            <XAxis
                                dataKey="formattedTime"
                                tick={{
                                    fill: "var(--color-text-secondary)",
                                    fontSize: 12,
                                }}
                                tickLine={false}
                                axisLine={{ stroke: "#9ca3af50" }}
                            />
                            <YAxis
                                tick={{
                                    fill: "var(--color-text-secondary)",
                                    fontSize: 12,
                                }}
                                tickLine={false}
                                axisLine={{ stroke: "#9ca3af50" }}
                                width={35}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor:
                                        "var(--color-background-secondary)",
                                    border: "1px solid var(--color-border)",
                                    borderRadius: "8px",
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                    padding: "10px 14px",
                                }}
                                labelStyle={{
                                    color: "var(--color-text-primary)",
                                    fontWeight: "bold",
                                    marginBottom: "4px",
                                }}
                                formatter={(value) => [
                                    `${value} events`,
                                    "Count",
                                ]}
                                labelFormatter={(_, data) => {
                                    if (data && data[0]) {
                                        const item = data[0].payload;
                                        const activeTimeFrame =
                                            onTimeFrameChange
                                                ? timeFrame
                                                : localTimeFrame;
                                        if (activeTimeFrame === "1h") {
                                            return `${item.formattedTime}`;
                                        } else if (activeTimeFrame === "24h") {
                                            return `${item.formattedTime}`;
                                        } else {
                                            return new Date(
                                                item.date
                                            ).toLocaleDateString();
                                        }
                                    }
                                    return "";
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="count"
                                name="Events"
                                stroke="#3b82f6"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorCount)"
                                activeDot={{
                                    r: 6,
                                    stroke: "#3b82f6",
                                    strokeWidth: 2,
                                    fill: "white",
                                }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                ) : (
                    <p className="text-gray-500 dark:text-gray-400">
                        No events recorded for this time period
                    </p>
                )}
            </div>
        </div>
    );
}
