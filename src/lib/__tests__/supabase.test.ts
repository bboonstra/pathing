import { createBrowserClient } from "@supabase/ssr";
import { supabase } from "../supabase";

// Mock createBrowserClient
jest.mock("@supabase/ssr", () => ({
    createBrowserClient: jest
        .fn()
        .mockReturnValue({ mockSupabaseClient: true }),
}));

// No need to mock environment variables directly - they're set in jest.globalSetup.js

describe("supabase client", () => {
    it("should create a browser supabase client with correct params", () => {
        // Assert that createBrowserClient was called with correct parameters
        expect(createBrowserClient).toHaveBeenCalledWith(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        );

        // Verify the exported client is what we expect
        expect(supabase).toEqual({ mockSupabaseClient: true });
    });
});
