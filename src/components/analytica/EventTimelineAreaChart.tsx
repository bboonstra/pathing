import React from "react";
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    AreaChart,
} from "recharts";
import type {
    EventsChartData,
    TimeFrame,
} from "@/components/analytica/EventTimelineChart";

interface EventTimelineAreaChartProps {
    chartData: EventsChartData[];
    timeFrame: TimeFrame;
    isLoading?: boolean;
}

export default function EventTimelineAreaChart({
    chartData,
    timeFrame,
    isLoading = false,
}: EventTimelineAreaChartProps) {
    return (
        <div className="bg-white/50 dark:bg-[#181824]/50 rounded-lg p-6 flex items-center justify-center min-h-[200px]">
            {isLoading ? (
                <p className="text-gray-500 dark:text-gray-400">
                    Loading data...
                </p>
            ) : chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart
                        data={chartData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
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
                            formatter={(value) => [`${value} events`, "Count"]}
                            labelFormatter={(_, data) => {
                                if (data && data[0]) {
                                    const item = data[0].payload;
                                    if (
                                        timeFrame === "1h" ||
                                        timeFrame === "24h"
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
}
