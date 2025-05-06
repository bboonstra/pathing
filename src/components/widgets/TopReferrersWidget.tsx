import React, { useMemo } from "react";
import { WidgetProps } from "@/types/widgets";
import BaseWidget from "./BaseWidget";
import { TimeFrame } from "@/components/EventTimelineChart";
import widgetRegistry from "@/utils/widgetRegistry";

// Register widget definition
widgetRegistry.register({
    type: "topReferrers",
    name: "Top Referrers",
    description: "Display the most common sources of traffic to your site",
    icon: "home",
    constraints: {
        minWidth: 1,
        maxWidth: 2,
        minHeight: 2,
        maxHeight: 3,
        defaultWidth: 2,
        defaultHeight: 2,
    },
    configFields: [
        {
            key: "timeFrame",
            type: "timeFrame",
            label: "Time Frame",
            defaultValue: "7d",
            description: "Time period to analyze referrers",
        },
        {
            key: "maxItems",
            type: "number",
            label: "Maximum Items",
            defaultValue: 5,
            description: "Maximum number of referrers to display",
        },
    ],
});

interface ReferrerCount {
    referrer: string;
    count: number;
    percentage: number;
}

const TopReferrersWidget: React.FC<WidgetProps> = (props) => {
    const { config, events } = props;

    // Get settings
    const timeFrame = (config.settings.timeFrame as TimeFrame) || "7d";
    const maxItems = (config.settings.maxItems as number) || 5;

    // Format referrer URL for display
    const formatReferrer = (referrer: string): string => {
        if (referrer === "Direct") return "Direct";

        try {
            const url = new URL(referrer);
            return url.hostname.replace(/^www\./, "");
        } catch {
            // If not a valid URL, return as is
            return referrer;
        }
    };

    // Calculate top referrers
    const referrers = useMemo(() => {
        if (events.length === 0) return [];

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

        // Count referrers
        const referrerCounts: Record<string, number> = {};
        filteredEvents.forEach((event) => {
            const rawReferrer = event.payload?.referrer || "Direct";
            const formattedReferrer = formatReferrer(rawReferrer);
            referrerCounts[formattedReferrer] =
                (referrerCounts[formattedReferrer] || 0) + 1;
        });

        // Sort and format referrers
        const total = Object.values(referrerCounts).reduce(
            (sum, count) => sum + count,
            0
        );

        return Object.entries(referrerCounts)
            .map(
                ([referrer, count]): ReferrerCount => ({
                    referrer,
                    count,
                    percentage: (count / total) * 100,
                })
            )
            .sort((a, b) => b.count - a.count)
            .slice(0, maxItems);
    }, [events, timeFrame, maxItems]);

    return (
        <BaseWidget {...props}>
            <div className="h-full flex flex-col p-2">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    Top traffic sources
                </div>

                {referrers.length === 0 ? (
                    <div className="flex-grow flex items-center justify-center">
                        <p className="text-gray-500 dark:text-gray-400">
                            No referrer data available
                        </p>
                    </div>
                ) : (
                    <div className="flex-grow">
                        {referrers.map((referrer, index) => (
                            <div key={index} className="mb-2 last:mb-0">
                                <div className="flex justify-between mb-1">
                                    <span className="text-xs font-medium">
                                        {referrer.referrer}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {referrer.count} (
                                        {referrer.percentage.toFixed(1)}%)
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full"
                                        style={{
                                            width: `${referrer.percentage}%`,
                                        }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </BaseWidget>
    );
};

export default TopReferrersWidget;
