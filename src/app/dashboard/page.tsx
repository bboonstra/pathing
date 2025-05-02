import DomainList from "./DomainList";

/**
 * Default Dashboard Page Server Component
 * Displays the list of domains.
 */
export default async function DashboardPage() {
    // No need for supabase client or user check here, handled by layout.tsx
    // No need to extract view or domain from searchParams

    // Render the list of domains by default
    return <DomainList />;
}
