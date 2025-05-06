import { WidgetDefinition, WidgetType } from "@/types/widgets";

// Registry to hold all widget definitions
class WidgetRegistry {
    private definitions: Map<WidgetType, WidgetDefinition> = new Map();

    // Register a widget definition
    register(definition: WidgetDefinition): void {
        this.definitions.set(definition.type, definition);
    }

    // Get a widget definition by type
    getDefinition(type: WidgetType): WidgetDefinition | undefined {
        return this.definitions.get(type);
    }

    // Get all registered widget definitions
    getAllDefinitions(): WidgetDefinition[] {
        return Array.from(this.definitions.values());
    }

    // Check if a widget type is registered
    hasWidget(type: WidgetType): boolean {
        return this.definitions.has(type);
    }

    // Get constraints for a widget type
    getConstraints(
        type: WidgetType
    ): WidgetDefinition["constraints"] | undefined {
        const definition = this.getDefinition(type);
        return definition?.constraints;
    }

    // Get configuration fields for a widget type
    getConfigFields(
        type: WidgetType
    ): WidgetDefinition["configFields"] | undefined {
        const definition = this.getDefinition(type);
        return definition?.configFields;
    }
}

// Create and export a singleton instance
const widgetRegistry = new WidgetRegistry();
export default widgetRegistry;
