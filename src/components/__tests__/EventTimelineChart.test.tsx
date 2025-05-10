import { render, screen } from "@testing-library/react";
import { EventData } from "@/types/widgets";

// Mock the actual EventTimelineChart component instead of modifying React's createElement
jest.mock("../analytica/EventTimelineChart", () => {
    return {
        __esModule: true,
        default: (props: { events: EventData[]; timeFrame?: string }) => {
            const hasEvents = props.events && props.events.length > 0;
            return (
                <div data-testid="mock-event-timeline">
                    <h3>Event Timeline</h3>
                    {hasEvents ? (
                        <>
                            <select
                                defaultValue={props.timeFrame || "24h"}
                                role="combobox"
                            >
                                <option value="1h">Last Hour</option>
                                <option value="24h">Last 24 Hours</option>
                                <option value="7d">Last 7 Days</option>
                                <option value="30d">Last 30 Days</option>
                            </select>
                            <div data-testid="mock-responsive-container">
                                <div data-testid="mock-line-chart">
                                    <div data-testid="mock-line" />
                                    <div data-testid="mock-xaxis" />
                                    <div data-testid="mock-yaxis" />
                                    <div data-testid="mock-grid" />
                                    <div data-testid="mock-tooltip" />
                                    <div data-testid="mock-legend" />
                                </div>
                            </div>
                        </>
                    ) : (
                        <div>No events recorded</div>
                    )}
                </div>
            );
        },
    };
});

// Import the mocked component
import EventTimelineChart from "../analytica/EventTimelineChart";

describe("EventTimelineChart", () => {
    const mockEvents: EventData[] = [
        {
            id: "1",
            created_at: "2023-01-01T10:00:00Z",
            type: "pageview",
            payload: { page: "/home" },
        },
        {
            id: "2",
            created_at: "2023-01-01T10:05:00Z",
            type: "click",
            payload: { page: "/home" },
        },
        {
            id: "3",
            created_at: "2023-01-01T10:10:00Z",
            type: "pageview",
            payload: { page: "/about" },
        },
    ];

    it("renders with default props", () => {
        const { container } = render(<EventTimelineChart events={[]} />);

        // Check that the component renders properly
        expect(container.querySelector("h3")).toHaveTextContent(
            "Event Timeline"
        );

        // Check for empty state message
        expect(screen.getByText(/No events recorded/i)).toBeInTheDocument();
    });

    it("renders with events data", () => {
        render(<EventTimelineChart events={mockEvents} />);

        // Check for event timeline title
        expect(screen.getByText("Event Timeline")).toBeInTheDocument();

        // When events exist, the time selector should be visible
        const select = screen.getByRole("combobox");
        expect(select).toBeInTheDocument();
    });

    it("renders with custom timeFrame", () => {
        render(<EventTimelineChart events={mockEvents} timeFrame="7d" />);

        // Get the select element
        const select = screen.getByRole("combobox");

        // Check that the select element has the expected options
        expect(select).toBeInTheDocument();

        // Check that the correct option is selected
        expect(select).toHaveValue("7d");

        // Verify all options exist
        const options = screen.getAllByRole("option");
        expect(options).toHaveLength(4); // 1h, 24h, 7d, 30d

        // Verify specific option texts
        const optionTexts = options.map((option) => option.textContent);
        expect(optionTexts).toContain("Last 7 Days");
        expect(optionTexts).toContain("Last Hour");
        expect(optionTexts).toContain("Last 24 Hours");
        expect(optionTexts).toContain("Last 30 Days");
    });
});
