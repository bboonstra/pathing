import { NextResponse } from "next/server";

interface Event {
    id: string;
    domain_id?: string;
    type?: string;
    payload?: {
        path?: string;
        referrer?: string;
        title?: string;
        [key: string]: string | number | boolean | null | undefined;
    } | null;
    created_at: string;
    [key: string]: string | number | boolean | null | undefined | object;
}

// Cache the events data
let cachedEvents: Event[] | null = null;
let lastGenerated = 0;

function generateEvents(): Event[] {
    const events: Event[] = [];
    const now = new Date();
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Generate events for each day from a month ago to today
    for (
        let date = oneMonthAgo;
        date <= now;
        date.setDate(date.getDate() + 1)
    ) {
        // Generate 20-100 random events for each day
        const eventsPerDay = Math.floor(Math.random() * 81) + 20; // Random number between 20-100

        for (let i = 0; i < eventsPerDay; i++) {
            // Create a random time within the day
            const randomTime = new Date(
                date.getTime() + Math.random() * 24 * 60 * 60 * 1000
            );

            events.push({
                id: `${date.toISOString().split("T")[0]}-${i}`,
                created_at: randomTime.toISOString(),
                type: "pageview",
                payload: {
                    path: "/",
                    referrer: "https://example.com",
                    title: "Homepage",
                },
            });
        }
    }

    return events;
}

export async function GET() {
    const now = Date.now();
    const ONE_HOUR = 60 * 60 * 1000;

    // If cache is empty or older than 1 hour, regenerate
    if (!cachedEvents || now - lastGenerated > ONE_HOUR) {
        cachedEvents = generateEvents();
        lastGenerated = now;
    }

    return NextResponse.json({ events: cachedEvents });
}
