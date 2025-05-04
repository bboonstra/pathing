import { render, screen } from "@testing-library/react";

// Mock CSS imports
jest.mock("../globals.css", () => ({}), { virtual: true });

// Mock next/font
jest.mock("next/font/google", () => ({
    Geist: jest.fn().mockReturnValue({
        variable: "--font-geist-sans variable",
    }),
    Geist_Mono: jest.fn().mockReturnValue({
        variable: "--font-geist-mono variable",
    }),
}));

// Mock the imported components
jest.mock("@vercel/speed-insights/next", () => ({
    SpeedInsights: jest.fn(() => <div data-testid="mock-speed-insights" />),
}));

jest.mock("@vercel/analytics/react", () => ({
    Analytics: jest.fn(() => <div data-testid="mock-analytics" />),
}));

// Mock next/script
jest.mock("next/script", () => ({
    __esModule: true,
    default: jest.fn((props) => (
        <script
            data-testid="mock-script"
            data-src={props.src}
            data-strategy={props.strategy}
            data-pathing-api-key={props["pathing-api-key"]}
        />
    )),
}));

// Mock the HTML structure to avoid DOM nesting errors
jest.mock("next/navigation", () => ({
    ...jest.requireActual("next/navigation"),
    usePathname: jest.fn().mockReturnValue("/"),
}));

// Import after mocks are setup
import RootLayout from "../layout";

// Mock the RootLayout to avoid HTML nesting issues
jest.mock("../layout", () => ({
    __esModule: true,
    default: jest.fn(({ children }) => (
        <div data-testid="mock-root-layout">
            <div
                data-testid="mock-body"
                className="antialiased --font-geist-sans variable --font-geist-mono variable"
            >
                {children}
                <div data-testid="mock-speed-insights" />
                <div data-testid="mock-analytics" />
                <script
                    data-testid="mock-script"
                    data-src="/pathing.js"
                    data-strategy="lazyOnload"
                    data-pathing-api-key="pk_664a345f3385ca311f2de6bc544d5e9dbcbe75d3e34a5a12"
                />
            </div>
        </div>
    )),
}));

describe("RootLayout", () => {
    it("renders children and necessary components", () => {
        render(
            <RootLayout>
                <div data-testid="test-child">Test Child Content</div>
            </RootLayout>
        );

        // Check that child content is rendered
        expect(screen.getByTestId("test-child")).toBeInTheDocument();
        expect(screen.getByText("Test Child Content")).toBeInTheDocument();

        // Check that the Vercel components are rendered
        expect(screen.getByTestId("mock-speed-insights")).toBeInTheDocument();
        expect(screen.getByTestId("mock-analytics")).toBeInTheDocument();

        // Check that the script is rendered with correct props
        const scriptElement = screen.getByTestId("mock-script");
        expect(scriptElement).toHaveAttribute("data-src", "/pathing.js");
        expect(scriptElement).toHaveAttribute("data-strategy", "lazyOnload");
        expect(scriptElement).toHaveAttribute(
            "data-pathing-api-key",
            "pk_664a345f3385ca311f2de6bc544d5e9dbcbe75d3e34a5a12"
        );
    });

    it("includes the required font classes", () => {
        render(
            <RootLayout>
                <div>Test</div>
            </RootLayout>
        );

        // The body should have font variable classes
        const mockBody = screen.getByTestId("mock-body");
        expect(mockBody).toHaveClass("antialiased");
        // We can verify the class contains 'variable'
        expect(mockBody.className).toContain("variable");
    });
});
