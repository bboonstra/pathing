"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { pathing } from "pathingjs";
import EventTimelineChart from "@/components/analytica/EventTimelineChart";
import type {
    EventData,
    TimeFrame,
} from "@/components/analytica/EventTimelineChart";

type DailyEvent = {
    date: string;
    count: number;
};

type UsageStats = {
    total_events: number;
    total_domains: number;
    current_cost: number;
    free_events_remaining: number;
    daily_events?: DailyEvent[];
    events?: EventData[];
};

export default function PricingDashboard() {
    const [usageStats, setUsageStats] = useState<UsageStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [timeFrame, setTimeFrame] = useState<TimeFrame>("7d");

    useEffect(() => {
        // Initialize pathing
        const apiKey = process.env.NEXT_PUBLIC_PATHING_API_KEY;
        if (apiKey) {
            pathing.init(apiKey);
        }

        fetchUsageStats();
    }, []);

    async function fetchUsageStats() {
        try {
            setLoading(true);
            setError(null);

            // Get total events across all domains
            const { data: eventsData, error: eventsError } = await supabase
                .from("events")
                .select("id, created_at, domain_id, type, payload");

            if (eventsError) throw eventsError;

            // Get daily events for the chart
            const dailyEvents = eventsData
                ?.reduce((acc: DailyEvent[], event) => {
                    const date = new Date(event.created_at)
                        .toISOString()
                        .split("T")[0];
                    const existingDate = acc.find((d) => d.date === date);
                    if (existingDate) {
                        existingDate.count++;
                    } else {
                        acc.push({ date, count: 1 });
                    }
                    return acc;
                }, [])
                .sort((a: DailyEvent, b: DailyEvent) =>
                    a.date.localeCompare(b.date)
                );

            // Get total domains
            const { data: domainsData, error: domainsError } = await supabase
                .from("domains")
                .select("id");

            if (domainsError) throw domainsError;

            const totalEvents = eventsData?.length || 0;
            const totalDomains = domainsData?.length || 0;
            const freeEvents = 1000; // Free tier limit
            const freeEventsRemaining = Math.max(0, freeEvents - totalEvents);
            const billableEvents = Math.max(0, totalEvents - freeEvents);
            const currentCost = billableEvents * 0.0001; // $0.0001 per event

            // Convert events to EventData format
            const formattedEvents: EventData[] =
                eventsData?.map((event) => ({
                    id: event.id,
                    domain_id: event.domain_id,
                    type: event.type,
                    payload: event.payload,
                    created_at: event.created_at,
                })) || [];

            setUsageStats({
                total_events: totalEvents,
                total_domains: totalDomains,
                current_cost: currentCost,
                free_events_remaining: freeEventsRemaining,
                daily_events: dailyEvents,
                events: formattedEvents,
            });
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("An unknown error occurred");
            }
        } finally {
            setLoading(false);
        }
    }

    const handleTimeFrameChange = (newTimeFrame: TimeFrame) => {
        setTimeFrame(newTimeFrame);
    };

    // Loading skeleton component
    const LoadingSkeleton = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
                <div
                    key={i}
                    className="bg-white/70 dark:bg-[#23233a]/70 rounded-xl shadow-lg p-6 border border-white/20 dark:border-white/5 animate-pulse"
                >
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4" role="main">
            <div className="mb-8">
                <h1 className="text-2xl font-bold mb-2">Usage & Billing</h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Monitor your usage and manage your billing settings
                </p>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
                    {error}
                    <button
                        onClick={fetchUsageStats}
                        className="ml-4 underline hover:no-underline"
                        aria-label="Retry loading usage statistics"
                    >
                        Retry
                    </button>
                </div>
            )}

            {loading ? (
                <LoadingSkeleton />
            ) : usageStats ? (
                <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Total Events Card */}
                        <div className="bg-white/70 dark:bg-[#23233a]/70 rounded-xl shadow-lg p-6 border border-white/20 dark:border-white/5">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                Total Events
                            </h3>
                            <p className="text-2xl font-bold">
                                {usageStats.total_events.toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                {usageStats.free_events_remaining > 0
                                    ? `${usageStats.free_events_remaining.toLocaleString()} free events remaining`
                                    : "Free tier limit reached"}
                            </p>
                        </div>

                        {/* Total Domains Card */}
                        <div className="bg-white/70 dark:bg-[#23233a]/70 rounded-xl shadow-lg p-6 border border-white/20 dark:border-white/5">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                Total Domains
                            </h3>
                            <p className="text-2xl font-bold">
                                {usageStats.total_domains}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                Tracked across your websites
                            </p>
                        </div>

                        {/* Current Cost Card */}
                        <div className="bg-white/70 dark:bg-[#23233a]/70 rounded-xl shadow-lg p-6 border border-white/20 dark:border-white/5">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                Current Cost
                            </h3>
                            <p className="text-2xl font-bold">
                                ${usageStats.current_cost.toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                Based on{" "}
                                {usageStats.total_events.toLocaleString()}{" "}
                                events
                            </p>
                        </div>

                        {/* Billing Status Card */}
                        <div className="bg-white/70 dark:bg-[#23233a]/70 rounded-xl shadow-lg p-6 border border-white/20 dark:border-white/5">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                Billing Status
                            </h3>
                            <p className="text-2xl font-bold">
                                {usageStats.current_cost > 0
                                    ? "Active"
                                    : "Free Tier"}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                {usageStats.current_cost > 0
                                    ? "Usage-based billing enabled"
                                    : "Using free tier benefits"}
                            </p>
                        </div>
                    </div>

                    {/* Usage Trends Chart - replaced with EventTimelineChart */}
                    <div className="mt-8">
                        {usageStats.events && (
                            <EventTimelineChart
                                events={usageStats.events}
                                timeFrame={timeFrame}
                                onTimeFrameChange={handleTimeFrameChange}
                                isLoading={loading}
                            />
                        )}
                    </div>

                    {/* Paddle integration */}
                    <div className="mt-8">
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                            <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                                🚧 Paddle Integration Coming Soon
                            </h3>
                            <p className="text-yellow-700 dark:text-yellow-300">
                                We&apos;re currently working on integrating
                                Paddle for seamless payments. This feature will
                                be available soon. For now, you can continue
                                using the free tier of our service.
                            </p>
                        </div>
                    </div>
                </div>
            ) : null}

            {/* Pricing Information */}
            <div className="mt-12">
                <h2 className="text-xl font-bold mb-4">Pricing Details</h2>
                <div className="bg-white/70 dark:bg-[#23233a]/70 rounded-xl shadow-lg p-6 border border-white/20 dark:border-white/5">
                    <div className="prose dark:prose-invert max-w-none">
                        <h3 className="text-lg font-semibold mb-2">
                            Free Tier
                        </h3>
                        <ul className="list-disc list-inside mb-4">
                            <li>1,000 events per month</li>
                            <li>Unlimited domains</li>
                            <li>Basic analytics</li>
                            <li>Community support</li>
                        </ul>

                        <h3 className="text-lg font-semibold mb-2">
                            Usage-Based Pricing
                        </h3>
                        <ul className="list-disc list-inside mb-4">
                            <li>$0.0001 per event after free tier</li>
                            <li>No monthly minimum</li>
                            <li>Pay only for what you use</li>
                            <li>Advanced analytics</li>
                            <li>Priority support</li>
                        </ul>

                        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                            <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                                Need a custom plan?
                            </h4>
                            <p className="text-blue-800 dark:text-blue-200 mb-3">
                                For enterprise customers or custom requirements,
                                contact our sales team.
                            </p>
                            <a
                                href="mailto:enterprise@pathing.cc"
                                className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium hover:text-blue-800 dark:hover:text-blue-300"
                            >
                                Contact Sales
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
