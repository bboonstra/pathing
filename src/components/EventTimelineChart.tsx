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
    [key: string]: string | number | boolean | null | undefined | object;
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
    hideBoundingBox?: boolean;
    hideTooltip?: boolean;
}

export default function EventTimelineChart({
    events,
    timeFrame = "24h",
    onTimeFrameChange,
    isLoading = false,
    hideBoundingBox = false,
    hideTooltip = false,
}: EventTimelineChartProps) {
    const [chartData, setChartData] = useState<EventsChartData[]>([]);
    const [localTimeFrame, setLocalTimeFrame] = useState<TimeFrame>(timeFrame);

    console.log(
        "EventTimelineChart render - events:",
        events.length,
        "timeFrame:",
        timeFrame
    );

    const handleTimeFrameChange = (newTimeFrame: TimeFrame) => {
        if (onTimeFrameChange) {
            onTimeFrameChange(newTimeFrame);
        } else {
            setLocalTimeFrame(newTimeFrame);
        }
    };

    useEffect(() => {
        console.log(
            "EventTimelineChart useEffect - processing events:",
            events.length
        );
        if (events.length === 0) {
            setChartData([]);
            return;
        }

        const activeTimeFrame = onTimeFrameChange ? timeFrame : localTimeFrame;
        const now = new Date();
        const startTime = new Date(now);

        switch (activeTimeFrame) {
            case "1h":
                startTime.setHours(now.getHours() - 1);
                break;
            case "24h":
                startTime.setHours(now.getHours() - 23); // include the current hour
                break;
            case "7d":
                startTime.setDate(now.getDate() - 6);
                break;
            case "30d":
                startTime.setDate(now.getDate() - 30);
                break;
        }

        const filteredEvents = events.filter((event) => {
            const eventDate = new Date(event.created_at);
            // Convert event UTC time to local time for comparison
            const eventLocalTime = new Date(
                eventDate.getTime() - eventDate.getTimezoneOffset() * 60000
            );
            return eventLocalTime >= startTime;
        });

        const format: "minute" | "hour" | "day" =
            activeTimeFrame === "1h"
                ? "minute"
                : activeTimeFrame === "24h"
                ? "hour"
                : "day";

        const eventsByTime: Record<string, number> = {};
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

        filteredEvents.forEach((event) => {
            const serverDate = new Date(event.created_at);
            const date = new Date(
                serverDate.getTime() - serverDate.getTimezoneOffset() * 60000
            );
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

                return { date: timeKey, formattedTime, count };
            })
            .sort((a, b) => a.date.localeCompare(b.date));

        // Consolidate any data points with the same formatted time
        const consolidatedData: EventsChartData[] = [];
        const timeMap: Record<string, number> = {};

        data.forEach((item) => {
            if (timeMap[item.formattedTime] === undefined) {
                timeMap[item.formattedTime] = consolidatedData.length;
                consolidatedData.push(item);
            } else {
                const index = timeMap[item.formattedTime];
                // Keep the entry with actual events (higher count)
                if (item.count > consolidatedData[index].count) {
                    consolidatedData[index] = item;
                }
            }
        });

        console.log(
            "Final chart data structure:",
            JSON.stringify(consolidatedData[0], null, 2)
        );
        console.log("Chart data length:", consolidatedData.length);
        setChartData(consolidatedData);
    }, [events, timeFrame, localTimeFrame, onTimeFrameChange]);

    const activeTimeFrame = onTimeFrameChange ? timeFrame : localTimeFrame;

    const chartContent = (
        <div
            className={`${
                hideBoundingBox
                    ? "w-full h-full"
                    : "bg-white/50 dark:bg-[#181824]/50 rounded-lg p-6 w-full"
            } flex items-center justify-center min-h-[300px]`}
        >
            {isLoading ? (
                <p className="text-gray-500 dark:text-gray-400">
                    Loading data...
                </p>
            ) : chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart
                        data={chartData}
                        margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
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
                                    stopColor="var(--chart-stroke, #4f46e5)"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--chart-stroke, #4f46e5)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                        </defs>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="var(--grid-color, rgba(156, 163, 175, 0.2))"
                            vertical={false}
                        />
                        <XAxis
                            dataKey="formattedTime"
                            tick={{
                                fill: "var(--axis-color, #9ca3af)",
                                fontSize: 12,
                            }}
                            tickLine={false}
                            axisLine={{
                                stroke: "var(--axis-line-color, rgba(156, 163, 175, 0.3))",
                            }}
                            interval="preserveStartEnd"
                            minTickGap={20}
                        />
                        <YAxis
                            tick={{
                                fill: "var(--axis-color, #9ca3af)",
                                fontSize: 12,
                            }}
                            tickLine={false}
                            axisLine={{
                                stroke: "var(--axis-line-color, rgba(156, 163, 175, 0.3))",
                            }}
                            width={35}
                        />
                        {!hideTooltip && (
                            <Tooltip
                                contentStyle={{
                                    backgroundColor:
                                        "var(--tooltip-bg, rgba(255, 255, 255, 0.9))",
                                    color: "var(--tooltip-color, #171717)",
                                    border: "var(--tooltip-border, 1px solid rgba(209, 213, 219, 0.5))",
                                    borderRadius: "8px",
                                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                                    padding: "10px 14px",
                                }}
                                labelStyle={{
                                    color: "var(--tooltip-label-color, #171717)",
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
                                        if (
                                            activeTimeFrame === "1h" ||
                                            activeTimeFrame === "24h"
                                        ) {
                                            return item.formattedTime;
                                        } else {
                                            return new Date(
                                                item.date
                                            ).toLocaleDateString();
                                        }
                                    }
                                    return "";
                                }}
                                wrapperStyle={{ outline: "none" }}
                            />
                        )}
                        <Area
                            type="monotone"
                            dataKey="count"
                            name="Events"
                            stroke="var(--chart-stroke, #4f46e5)"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorCount)"
                            activeDot={{
                                r: 6,
                                stroke: "var(--chart-stroke, #4f46e5)",
                                strokeWidth: 2,
                                fill: "var(--chart-dot-fill, white)",
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
    );

    if (hideBoundingBox) {
        return chartContent;
    }

    return (
        <div className="p-4 bg-white/40 dark:bg-[#212134]/40 rounded-lg border border-gray-200 dark:border-gray-800 mb-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Event Timeline</h3>
                <div className="flex space-x-2">
                    <select
                        value={activeTimeFrame}
                        onChange={(e) =>
                            handleTimeFrameChange(e.target.value as TimeFrame)
                        }
                        className="px-3 py-1 text-sm bg-white/90 dark:bg-[#181824]/90 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="1h">Last Hour</option>
                        <option value="24h">Last 24 Hours</option>
                        <option value="7d">Last 7 Days</option>
                        <option value="30d">Last 30 Days</option>
                    </select>
                </div>
            </div>
            {chartContent}
        </div>
    );
}
