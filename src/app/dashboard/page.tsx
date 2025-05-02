import { createServerSupabaseClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import Navbar from "./Navbar";
import DomainList from "./DomainList";
import DomainAnalytics from "./DomainAnalytics";
import AddDomain from "./AddDomain";

// Define the expected structure of search parameters
type SearchParams = {
    view?: string; // Optional view parameter (e.g., 'analytics', 'add-domain')
    domain?: string; // Optional domain ID parameter, likely used for analytics view
};

// Define the props for the Page component
interface PageProps {
    searchParams: SearchParams; // Receives searchParams from Next.js
}

/**
 * DashboardPage Server Component
 * Displays different views (Domain List, Add Domain, Domain Analytics)
 * based on URL search parameters.
 */
export default async function DashboardPage({ searchParams }: PageProps) {
    // Initialize Supabase client for server-side operations
    const supabase = await createServerSupabaseClient();

    // Fetch the current authenticated user
    const {
        data: { user },
    } = await supabase.auth.getUser();

    // If no user is found, redirect to the login page
    if (!user) {
        redirect("/login");
    }

    // Extract view and domain from searchParams to avoid synchronous access
    // Extract view and domain from searchParams to avoid synchronous access
    const { view, domain } = await searchParams;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-100 dark:from-[#0a0a0a] dark:via-[#181824] dark:to-[#1a1a2e] flex flex-col">
            {/* Render the navigation bar */}
            <Navbar />

            <div className="flex-grow flex flex-col items-center py-8 px-4">
                <div className="w-full max-w-5xl">
                    {/* Informational text */}
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                        Your analytics dashboard is ready to grow with you.
                    </p>

                    {/* Conditional Rendering based on view */}
                    {view === "analytics" ? (
                        // Render DomainAnalytics if view is 'analytics', passing the domainId
                        <DomainAnalytics domainId={domain} />
                    ) : view === "add-domain" ? (
                        // Render AddDomain component if view is 'add-domain'
                        <AddDomain />
                    ) : (
                        // Default view: Render the list of domains
                        <DomainList />
                    )}
                </div>
            </div>
        </div>
    );
}
