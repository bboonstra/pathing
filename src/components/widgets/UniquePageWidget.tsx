import React, { useMemo } from "react";
import { WidgetProps } from "@/types/widgets";
import BaseWidget from "./BaseWidget";
import { TimeFrame } from "@/components/EventTimelineChart";
import widgetRegistry from "@/utils/widgetRegistry";

// Register widget definition
widgetRegistry.register({
    type: "uniquePages",
    name: "Unique Pages",
    description:
        "Display the count of unique pages visited in a given time period",
    icon: "document-duplicate",
    constraints: {
        minWidth: 1,
        maxWidth: 2,
        minHeight: 2,
        maxHeight: 4,
        defaultWidth: 1,
        defaultHeight: 1,
    },
    configFields: [
        {
            key: "timeFrame",
            type: "timeFrame",
            label: "Time Frame",
            defaultValue: "24h",
            description: "Time period to count unique pages for",
        },
    ],
});

const UniquePageWidget: React.FC<WidgetProps> = (props) => {
    const { config, events } = props;

    // Get the time frame setting
    const timeFrame = (config.settings.timeFrame as TimeFrame) || "24h";

    // Calculate unique pages count based on time frame
    const uniquePagesCount = useMemo(() => {
        if (events.length === 0) return 0;

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

        const filteredEvents = events.filter((event) => {
            const eventDate = new Date(event.created_at);
            return eventDate >= startTime;
        });

        // Count unique page paths
        const uniquePaths = new Set();
        filteredEvents.forEach((event) => {
            if (event.payload?.path) {
                uniquePaths.add(event.payload.path);
            }
        });

        return uniquePaths.size;
    }, [events, timeFrame]);

    // Generate time frame label
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
            <div className="h-full flex flex-col items-center justify-center">
                <div className="text-3xl font-bold">{uniquePagesCount}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {timeFrameLabel}
                </div>
            </div>
        </BaseWidget>
    );
};

export default UniquePageWidget;
