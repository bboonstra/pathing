import React from "react";
import { WidgetProps } from "@/types/widgets";
import BaseWidget from "./BaseWidget";
import EventTimelineChart, {
    TimeFrame,
} from "@/components/analytica/EventTimelineChart";
import widgetRegistry from "@/utils/widgetRegistry";

// Register widget definition
widgetRegistry.register({
    type: "timeline",
    name: "Event Timeline",
    description: "Visualize events over time",
    icon: "timeline",
    constraints: {
        minWidth: 2,
        maxWidth: 4,
        minHeight: 3,
        maxHeight: 5,
        defaultWidth: 4,
        defaultHeight: 4,
    },
    configFields: [
        {
            key: "timeFrame",
            type: "timeFrame",
            label: "Time Frame",
            defaultValue: "24h",
            description: "Time period to display on the timeline",
        },
    ],
});

const TimelineWidget: React.FC<WidgetProps> = (props) => {
    const { config, events, isLoading, onSettingsChange } = props;

    // Convert the widget's time frame to EventTimelineChart's expected format
    const timeFrame = (config.settings.timeFrame as TimeFrame) || "24h";

    // This component renders the base widget with custom content
    return (
        <BaseWidget {...props}>
            <EventTimelineChart
                events={events}
                timeFrame={timeFrame}
                onTimeFrameChange={(newTimeFrame) =>
                    onSettingsChange(config.id, {
                        ...config.settings,
                        timeFrame: newTimeFrame,
                    })
                }
                isLoading={isLoading}
            />
        </BaseWidget>
    );
};

export default TimelineWidget;
