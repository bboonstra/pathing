"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import WidgetDashboard from "@/components/WidgetDashboard";
import { EventData } from "@/types/widgets";

type Domain = {
    id: string;
    name: string;
    public_key: string;
    verified: boolean;
};

interface DomainAnalyticsProps {
    domainId?: string;
}

export default function DomainAnalytics({ domainId }: DomainAnalyticsProps) {
    const [domains, setDomains] = useState<Domain[]>([]);
    const [selectedDomain, setSelectedDomain] = useState<string | null>(
        domainId || null
    );
    const [events, setEvents] = useState<EventData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch domains on component mount
    useEffect(() => {
        async function fetchDomains() {
            try {
                const { data, error } = await supabase
                    .from("domains")
                    .select("*")
                    .eq("verified", true);

                if (error) throw error;
                setDomains(data || []);

                // Auto-select the first domain if available and no domainId was provided
                if (!selectedDomain && data && data.length > 0) {
                    setSelectedDomain(data[0].id);
                }
            } catch (error) {
                setError(
                    error instanceof Error
                        ? error.message
                        : "An unknown error occurred"
                );
            } finally {
                if (!selectedDomain) {
                    setIsLoading(false);
                }
            }
        }

        fetchDomains();
    }, [selectedDomain]);

    // Fetch events when selected domain changes
    useEffect(() => {
        if (!selectedDomain) return;

        async function fetchEvents() {
            try {
                const { data, error } = await supabase
                    .from("events")
                    .select("*")
                    .eq("domain_id", selectedDomain)
                    .order("created_at", { ascending: false });

                if (error) throw error;
                setEvents(data || []);
            } catch (error) {
                setError(
                    error instanceof Error
                        ? error.message
                        : "An unknown error occurred"
                );
            } finally {
                setIsLoading(false);
            }
        }

        fetchEvents();
    }, [selectedDomain]);

    // Show message if no domains are available
    if (domains.length === 0 && !isLoading) {
        return (
            <div className="bg-white/70 dark:bg-[#23233a]/70 rounded-xl shadow-md p-6 border border-white/20 dark:border-white/5 w-full mb-8 backdrop-blur-sm">
                <h2 className="text-xl font-bold mb-4">Domain Analytics</h2>
                <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                        No verified domains found. Verify a domain to view
                        analytics.
                    </p>
                    <a
                        href="/dashboard/add-domain"
                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg shadow-sm hover:shadow-md transition-all"
                    >
                        Add & Verify Domain
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                {error && (
                    <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
                        {error}
                    </div>
                )}

                <div className="mb-6">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                        {domains.map((domain) => (
                            <button
                                key={domain.id}
                                onClick={() => setSelectedDomain(domain.id)}
                                className={`px-3 py-1.5 text-sm rounded-full transition-all duration-300 ${
                                    selectedDomain === domain.id
                                        ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium shadow-md"
                                        : "bg-white/50 dark:bg-[#23233a]/50 text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-[#23233a]/80 border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm"
                                }`}
                                disabled={isLoading}
                            >
                                {domain.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {selectedDomain && (
                <WidgetDashboard
                    domainId={selectedDomain}
                    events={events}
                    isLoading={isLoading}
                />
            )}
        </div>
    );
}
