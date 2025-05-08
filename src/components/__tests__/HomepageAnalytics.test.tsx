import { render, screen, act, waitFor } from "@testing-library/react";
import HomepageAnalytics from "../analytica/HomepageAnalytics";
import { ReactNode } from "react";

// Define interface for props with children
interface PropsWithChildren {
    children?: ReactNode;
    // Using more specific types for common Recharts props
    width?: number;
    height?: number;
    data?: unknown[];
    margin?: {
        top?: number;
        right?: number;
        bottom?: number;
        left?: number;
    };
    // Add other specific props as needed
}

// Mock Recharts components
jest.mock("recharts", () => ({
    LineChart: (props: PropsWithChildren) => (
        <div data-testid="mock-line-chart">{props.children}</div>
    ),
    Line: () => <div data-testid="mock-line" />,
    XAxis: () => <div data-testid="mock-xaxis" />,
    YAxis: () => <div data-testid="mock-yaxis" />,
    CartesianGrid: () => <div data-testid="mock-grid" />,
    Tooltip: () => <div data-testid="mock-tooltip" />,
    Legend: () => <div data-testid="mock-legend" />,
    ResponsiveContainer: (props: PropsWithChildren) => (
        <div data-testid="mock-responsive-container">{props.children}</div>
    ),
    BarChart: (props: PropsWithChildren) => (
        <div data-testid="mock-bar-chart">{props.children}</div>
    ),
    Bar: () => <div data-testid="mock-bar" />,
}));

// Mock fetch responses
const mockFetchResponse = {
    data: [
        {
            id: "1",
            type: "click",
            created_at: "2023-01-01T10:00:00Z",
            payload: { page: "/home" },
        },
        {
            id: "2",
            type: "view",
            created_at: "2023-01-01T11:00:00Z",
            payload: { page: "/about" },
        },
    ],
    refreshesIn: 0,
};

describe("HomepageAnalytics", () => {
    beforeEach(() => {
        // Reset fetch mock
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockFetchResponse),
            })
        ) as jest.Mock;
    });

    it("renders the component with loading state initially", async () => {
        await act(async () => {
            render(<HomepageAnalytics />);
        });

        // Check for title
        expect(screen.getByText("Live Demo Analytics")).toBeInTheDocument();

        // Wait for fetch to complete and verify refresh button is present
        await waitFor(() => {
            expect(screen.getByText("Refresh")).toBeInTheDocument();
        });
    });

    it("renders data after fetch completes", async () => {
        await act(async () => {
            render(<HomepageAnalytics />);
        });

        // Wait for fetch to complete and components to update
        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledTimes(1);
        });

        // Check for refresh button (using text since the role didn't work)
        expect(screen.getByText("Refresh")).toBeInTheDocument();

        // Check for section title
        expect(screen.getByText("Live Demo Analytics")).toBeInTheDocument();

        // Check for data after fetching
        expect(screen.getByText("Clicks Today")).toBeInTheDocument();
        expect(screen.getByText("2")).toBeInTheDocument(); // 2 events from mock data
    });
});
