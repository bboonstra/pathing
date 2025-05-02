import AddDomain from "../AddDomain"; // Adjust import path

// No need for SearchParams or PageProps here

/**
 * Add Domain Page Server Component
 * Displays the form to add a new domain.
 */
export default async function AddDomainPage() {
    // User authentication is handled by the layout
    // This page doesn't need searchParams

    // Render the AddDomain component
    return <AddDomain />;
}
