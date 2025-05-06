/**
 * This file handles registration of all widgets in the system
 * Import this once at application startup
 */

import widgetRegistry from "./widgetRegistry";

// Import all widget types to trigger their self-registration
import "@/components/widgets/ConversionMetricsWidget";
import "@/components/widgets/TimelineWidget";
import "@/components/widgets/EventCountWidget";
import "@/components/widgets/UniquePageWidget";
import "@/components/widgets/RecentEventsWidget";
import "@/components/widgets/TopReferrersWidget";
import "@/components/widgets/UserFlowWidget";
import "@/components/widgets/CorrelationInsightWidget";
// Add other widget imports as needed

export default function registerAllWidgets() {
    // Verify registration was successful
    const registeredWidgets = widgetRegistry.getAllDefinitions();
    console.log(
        `Registered ${registeredWidgets.length} widgets:`,
        registeredWidgets.map((w) => w.name).join(", ")
    );
}
