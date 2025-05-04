import {
    createWidget,
    generateInsightWidgets,
    analyzeEventPatterns,
} from "../widgetFactory";
import { WidgetType, EventData } from "@/types/widgets";

// Mock UUID for consistent testing
jest.mock("uuid", () => ({
    v4: () => "test-uuid",
}));

describe("widgetFactory", () => {
    beforeEach(() => {
        // Mock Date.now() for deterministic tests
        jest.useFakeTimers();
        jest.setSystemTime(new Date("2023-01-01"));
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    describe("createWidget", () => {
        it("creates a widget with the correct properties", () => {
            const widget = createWidget(
                "barChart" as WidgetType,
                "Test Widget",
                { i: "test-layout", x: 0, y: 0, w: 2, h: 1 },
                { testSetting: "value" }
            );

            expect(widget).toEqual({
                id: "test-uuid",
                type: "barChart",
                title: "Test Widget",
                layout: { i: "test-layout", x: 0, y: 0, w: 2, h: 1 },
                settings: { testSetting: "value" },
                dateAdded: "2023-01-01T00:00:00.000Z",
                dateUpdated: "2023-01-01T00:00:00.000Z",
            });
        });

        it("creates a widget with default settings when not provided", () => {
            const widget = createWidget(
                "lineChart" as WidgetType,
                "Test Widget",
                { i: "test-layout", x: 0, y: 0, w: 2, h: 1 }
            );

            expect(widget.settings).toEqual({});
        });
    });

    describe("generateInsightWidgets", () => {
        it("returns empty array when not enough events", () => {
            const events: EventData[] = [
                {
                    id: "1",
                    created_at: "2023-01-01T10:00:00Z",
                    type: "click",
                    payload: {},
                },
            ];

            const insights = generateInsightWidgets(events);
            expect(insights).toEqual([]);
        });
    });

    describe("analyzeEventPatterns", () => {
        it("returns empty patterns when no events are provided", () => {
            const patterns = analyzeEventPatterns([]);
            expect(patterns).toEqual({});
        });

        it("calculates average events per day", () => {
            const events: EventData[] = [
                {
                    id: "1",
                    created_at: "2023-01-01T10:00:00Z",
                    type: "click",
                    payload: {},
                },
                {
                    id: "2",
                    created_at: "2023-01-01T11:00:00Z",
                    type: "view",
                    payload: {},
                },
                {
                    id: "3",
                    created_at: "2023-01-02T12:00:00Z",
                    type: "click",
                    payload: {},
                },
            ];

            const patterns = analyzeEventPatterns(events);
            expect(patterns.averageEventsPerDay).toBe(1.5); // 3 events over 2 days
        });
    });
});
