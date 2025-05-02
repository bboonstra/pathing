/**
 * Utility functions for the Pathing application
 */

/**
 * Validates if a string is a properly formatted domain name
 * @param domain Domain name to validate
 * @returns Boolean indicating if domain is valid
 */
export function isValidDomainFormat(domain: string): boolean {
    if (!domain) return false;

    // Remove protocol and path if present
    let domainName = domain;
    if (domainName.includes("://")) {
        domainName = domainName.split("://")[1];
    }

    // Remove path if present
    if (domainName.includes("/")) {
        domainName = domainName.split("/")[0];
    }

    // Basic domain regex - allows domains with at least one dot
    // This validates most common domain formats
    const domainRegex =
        /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/i;

    return domainRegex.test(domainName);
}

/**
 * Formats a domain by removing protocol and trailing slashes
 * @param domain Domain to clean
 * @returns Cleaned domain string
 */
export function formatDomain(domain: string): string {
    let formattedDomain = domain.trim().toLowerCase();

    // Remove protocol if present
    if (formattedDomain.includes("://")) {
        formattedDomain = formattedDomain.split("://")[1];
    }

    // Remove trailing slash if present
    if (formattedDomain.endsWith("/")) {
        formattedDomain = formattedDomain.slice(0, -1);
    }

    // Remove www. prefix if present
    if (formattedDomain.startsWith("www.")) {
        formattedDomain = formattedDomain.substring(4);
    }

    return formattedDomain;
}
