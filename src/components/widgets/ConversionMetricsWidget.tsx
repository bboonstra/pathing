import React, { useMemo } from "react";
import { WidgetProps } from "@/types/widgets";
import BaseWidget from "./BaseWidget";
import { TimeFrame } from "@/components/EventTimelineChart";

const ConversionMetricsWidget: React.FC<WidgetProps> = (props) => {
    const { config, events } = props;

    // Get settings
    const timeFrame = (config.settings.timeFrame as TimeFrame) || "30d";

    // Calculate conversion metrics
    const metrics = useMemo(() => {
        if (events.length === 0) return { rate: 0, count: 0, total: 0 };

        // Filter events by time frame
        const now = new Date();
        const startTime = new Date(now);

        switch (timeFrame) {
            case "1h":
                startTime.setHours(now.getHours() - 1);
                break;
            case "24h":
                startTime.setHours(now.getHours() - 24);
                break;
            case "7d":
                startTime.setDate(now.getDate() - 7);
                break;
            case "30d":
                startTime.setDate(now.getDate() - 30);
                break;
        }

        // Filter events by time frame
        const filteredEvents = events.filter((event) => {
            const eventDate = new Date(event.created_at);
            return eventDate >= startTime;
        });

        // Count page views and conversions
        const totalEvents = filteredEvents.length;
        const conversionEvents = filteredEvents.filter(
            (event) =>
                event.type &&
                (event.type === "conversion" ||
                    event.type.includes("purchase") ||
                    event.type.includes("signup") ||
                    event.type.includes("registration"))
        ).length;

        const conversionRate =
            totalEvents > 0 ? (conversionEvents / totalEvents) * 100 : 0;

        return {
            rate: conversionRate,
            count: conversionEvents,
            total: totalEvents,
        };
    }, [events, timeFrame]);

    // Get time frame label
    const timeFrameLabel = useMemo(() => {
        switch (timeFrame) {
            case "1h":
                return "Last Hour";
            case "24h":
                return "Last 24 Hours";
            case "7d":
                return "Last 7 Days";
            case "30d":
                return "Last 30 Days";
            default:
                return "All Time";
        }
    }, [timeFrame]);

    return (
        <BaseWidget {...props}>
            <div className="h-full flex flex-col items-center justify-center p-2">
                <div className="text-3xl font-bold text-purple-700 dark:text-purple-500">
                    {metrics.rate.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-3">
                    Conversion Rate ({timeFrameLabel})
                </div>

                <div className="flex justify-between w-full max-w-[200px] text-xs text-gray-600 dark:text-gray-400">
                    <div className="text-center">
                        <div className="font-semibold">{metrics.count}</div>
                        <div>Conversions</div>
                    </div>
                    <div className="text-center">
                        <div className="font-semibold">{metrics.total}</div>
                        <div>Total Events</div>
                    </div>
                </div>
            </div>
        </BaseWidget>
    );
};

export default ConversionMetricsWidget;
