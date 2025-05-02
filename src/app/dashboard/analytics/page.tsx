"use client";
import * as React from "react";
import DomainAnalytics from "../DomainAnalytics";

export default function DomainAnalyticsPage({
    searchParams,
}: {
    searchParams: Promise<{ domain?: string }>;
}) {
    // Unwrap the searchParams promise-like object
    const unwrappedSearchParams = React.use(searchParams);
    // Assert the type of the unwrapped value before destructuring
    const { domain } = unwrappedSearchParams as { domain?: string };
    return <DomainAnalytics domainId={domain} />;
}
