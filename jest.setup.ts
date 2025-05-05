// Add any global test setup here
// Import jest-dom matchers
import "@testing-library/jest-dom";
import React from "react";

// Set up React global
global.React = React;

// Mock Next.js router
jest.mock("next/navigation", () => ({
    useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
        prefetch: jest.fn(),
        back: jest.fn(),
        forward: jest.fn(),
    }),
    usePathname: () => "/",
    useSearchParams: () => new URLSearchParams(),
}));
