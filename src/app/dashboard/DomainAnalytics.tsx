"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import WidgetDashboard from "@/components/WidgetDashboard";
import { EventData } from "@/types/widgets";
import { useSearchParams } from "next/navigation";

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
    const searchParams = useSearchParams();
    const [domains, setDomains] = useState<Domain[]>([]);
    const [selectedDomain, setSelectedDomain] = useState<string | null>(
        domainId || searchParams.get("domain") || null
    );
    const [events, setEvents] = useState<EventData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Update URL with domain parameter without reloading the page
    const updateUrlWithDomain = useCallback((domainId: string) => {
        // Create a new URL object based on the current URL
        const url = new URL(window.location.href);
        // Set the domain query parameter
        url.searchParams.set("domain", domainId);
        // Update the URL without triggering a page navigation
        window.history.pushState({}, "", url.toString());
    }, []);

    // Fetch domains on component mount
    useEffect(() => {
        let isMounted = true;
        async function fetchDomainsData() {
            // setIsLoading(true) is implicitly handled by the initial state
            try {
                const { data, error: fetchError } = await supabase
                    .from("domains")
                    .select("*")
                    .eq("verified", true);

                if (!isMounted) return;

                if (fetchError) throw fetchError;
                setDomains(data || []);
            } catch (err) {
                if (!isMounted) return;
                setError(
                    err instanceof Error
                        ? err.message
                        : "An unknown error occurred"
                );
                setIsLoading(false); // On error fetching domains, stop loading.
            }
        }

        fetchDomainsData();
        return () => {
            isMounted = false;
        };
    }, []); // setError, setDomains, setIsLoading are stable and don't need to be listed

    // Auto-select domain if needed, and manage isLoading if no domain gets selected
    useEffect(() => {
        if (selectedDomain) {
            // A domain is selected (either initially, or by a previous auto-selection).
            // The event fetching useEffect is responsible for isLoading. Do nothing here.
            return;
        }

        // At this point, selectedDomain is null.
        if (domains.length > 0) {
            // domains are loaded and not empty
            const firstDomainId = domains[0].id;
            setSelectedDomain(firstDomainId);
            updateUrlWithDomain(firstDomainId); // updateUrlWithDomain is now declared above
            // Event fetcher will be triggered by setSelectedDomain and will manage isLoading.
        } else if (domains.length === 0) {
            // domains have been fetched and are empty. No domain to select.
            setIsLoading(false);
        }
        // If domains is still the initial empty array before fetch completes, this effect might run,
        // but the conditions ensure correct behavior once domains are populated.
    }, [domains, selectedDomain, updateUrlWithDomain]); // setSelectedDomain, setIsLoading are stable

    // Fetch events when selected domain changes
    useEffect(() => {
        if (!selectedDomain) {
            // If no domain is selected (e.g. after initial load and domain fetch, still no selection),
            // ensure loading is false. This might be redundant if the auto-select effect already handled it.
            // However, if selectedDomain becomes null due to other reasons, this is a safeguard.
            // Consider if this line is truly needed given the auto-select effect's isLoading handling.
            // For now, keeping it simple: if no selectedDomain, no event fetching, so not actively loading events.
            // The auto-select effect should correctly set isLoading to false if no domain is ultimately selected.
            return;
        }

        let isMounted = true;
        async function fetchEvents() {
            setIsLoading(true); // Set loading true before fetching events
            try {
                const { data, error: fetchError } = await supabase
                    .from("events")
                    .select("*")
                    .eq("domain_id", selectedDomain)
                    .order("created_at", { ascending: false });

                if (!isMounted) return;
                if (fetchError) throw fetchError;
                setEvents(data || []);
            } catch (err) {
                if (!isMounted) return;
                setError(
                    err instanceof Error
                        ? err.message
                        : "An unknown error occurred"
                );
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        fetchEvents();
        return () => {
            isMounted = false;
        };
    }, [selectedDomain]); // setError, setEvents, setIsLoading are stable

    // Handle domain selection
    const handleDomainSelect = (domainId: string) => {
        setSelectedDomain(domainId);
        updateUrlWithDomain(domainId);
    };

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
                                onClick={() => handleDomainSelect(domain.id)}
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
