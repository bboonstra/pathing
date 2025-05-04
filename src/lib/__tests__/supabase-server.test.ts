import { createServerSupabaseClient } from "../supabase-server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Mock dependencies
jest.mock("@supabase/ssr", () => ({
    createServerClient: jest.fn().mockReturnValue({ mockSupabaseClient: true }),
}));

jest.mock("next/headers", () => ({
    cookies: jest.fn(),
}));

// No need to mock environment variables directly - they're set in jest.globalSetup.js

describe("supabase-server", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should create a server supabase client", async () => {
        // Setup mocks
        const mockGetAll = jest.fn().mockReturnValue([]);
        const mockSet = jest.fn();
        const mockCookieStore = {
            getAll: mockGetAll,
            set: mockSet,
        };

        (cookies as jest.Mock).mockResolvedValue(mockCookieStore);

        // Call the function
        const client = await createServerSupabaseClient();

        // Verify the client was returned properly
        expect(client).toEqual({ mockSupabaseClient: true });

        // Assertions
        expect(createServerClient).toHaveBeenCalledWith(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            {
                cookies: {
                    getAll: expect.any(Function),
                    setAll: expect.any(Function),
                },
            }
        );

        // Test the cookies.getAll function
        const cookiesConfig = (createServerClient as jest.Mock).mock
            .calls[0][2];
        cookiesConfig.cookies.getAll();
        expect(mockGetAll).toHaveBeenCalled();

        // Test the cookies.setAll function
        const mockCookiesToSet = [
            { name: "test-cookie", value: "test-value", options: {} },
        ];
        cookiesConfig.cookies.setAll(mockCookiesToSet);
        expect(mockSet).toHaveBeenCalledWith("test-cookie", "test-value", {});
    });

    it("should handle errors when setting cookies", async () => {
        // Setup mocks
        const mockGetAll = jest.fn().mockReturnValue([]);
        const mockSet = jest.fn().mockImplementation(() => {
            throw new Error("Cannot set cookies in this context");
        });
        const mockCookieStore = {
            getAll: mockGetAll,
            set: mockSet,
        };

        (cookies as jest.Mock).mockResolvedValue(mockCookieStore);

        // Call the function
        const client = await createServerSupabaseClient();

        // Verify the client was returned
        expect(client).toEqual({ mockSupabaseClient: true });

        // Get the setAll function
        const cookiesConfig = (createServerClient as jest.Mock).mock
            .calls[0][2];

        // This should not throw despite mockSet throwing
        const mockCookiesToSet = [
            { name: "test-cookie", value: "test-value", options: {} },
        ];
        expect(() => {
            cookiesConfig.cookies.setAll(mockCookiesToSet);
        }).not.toThrow();
    });
});
