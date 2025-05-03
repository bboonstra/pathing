import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Initialize Supabase client with environment variables
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// In-memory cache
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cachedData: any = null;
let lastCacheTime: number = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

export async function GET() {
    const currentTime = Date.now();
    const timeElapsed = currentTime - lastCacheTime;
    const refreshesIn = Math.max(
        0,
        Math.floor((CACHE_DURATION - timeElapsed) / 1000)
    ); // Seconds until refresh available

    // Return cached data if it's less than an hour old
    if (cachedData && timeElapsed < CACHE_DURATION) {
        return NextResponse.json({
            data: cachedData,
            cached: true,
            cachedAt: new Date(lastCacheTime).toISOString(),
            refreshesIn,
        });
    }

    try {
        // Get current time and calculate the timestamp for 24 hours ago
        const now = new Date();
        const twentyFourHoursAgo = new Date(now);
        twentyFourHoursAgo.setDate(now.getDate() - 1);
        const twentyFourHoursAgoISO = twentyFourHoursAgo.toISOString();

        // Query for events from the last 24 hours
        const { data, error } = await supabase
            .from("events")
            .select("*")
            .eq("type", "button")
            .eq("domain_id", "98fee0c9-eea5-4fbe-baf8-8a608918466c")
            .gte("created_at", twentyFourHoursAgoISO)
            .filter("payload->>action", "eq", "demo_click")
            .filter("payload->>location", "eq", "homepage")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Supabase query error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Process data (convert UTC to local time as in original component)
        const processedData = (data || []).map((event) => {
            const date = new Date(event.created_at);
            date.setHours(date.getHours() - date.getTimezoneOffset() / 60);
            return {
                ...event,
                created_at: date.toString(),
            };
        });

        // Update cache
        cachedData = processedData;
        lastCacheTime = currentTime;

        return NextResponse.json({
            data: processedData,
            cached: false,
            cachedAt: new Date(lastCacheTime).toISOString(),
            refreshesIn: CACHE_DURATION / 1000, // Full cache duration in seconds
        });
    } catch (error) {
        console.error("Error fetching analytics:", error);
        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "An unknown error occurred",
            },
            { status: 500 }
        );
    }
}
