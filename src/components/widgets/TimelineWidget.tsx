import React from "react";
import { WidgetProps } from "@/types/widgets";
import BaseWidget from "./BaseWidget";
import EventTimelineChart, { TimeFrame } from "@/components/EventTimelineChart";

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
