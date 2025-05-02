import { NextRequest } from "next/server";
import * as dnsPromises from "dns/promises";
import { createServerSupabaseClient } from "@/lib/supabase-server";

// Add interface for DNS error
interface DnsError extends Error {
    code?: string;
    errno?: number;
    syscall?: string;
    hostname?: string;
}

export async function POST(req: NextRequest) {
    try {
        const supabase = await createServerSupabaseClient();

        // Get current user
        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: "You must be logged in to verify a domain",
                }),
                { status: 401, headers: { "Content-Type": "application/json" } }
            );
        }

        // Get the domain ID from the request
        const { domainId } = await req.json();

        if (!domainId) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: "Domain ID is required",
                }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        // Get the domain details
        const { data: domain, error: domainError } = await supabase
            .from("domains")
            .select("*")
            .eq("id", domainId)
            .eq("user_id", user.id)
            .single();

        if (domainError || !domain) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: "Domain not found or you don't have permission",
                }),
                { status: 404, headers: { "Content-Type": "application/json" } }
            );
        }

        if (domain.verified) {
            return new Response(
                JSON.stringify({
                    success: true,
                    message: "Domain is already verified",
                }),
                { status: 200, headers: { "Content-Type": "application/json" } }
            );
        }

        try {
            // Check for TXT record using dns/promises
            const records = await dnsPromises.resolveTxt(domain.name);

            // Check if any of the TXT records match our verification token
            const verified = records.some((record) =>
                record.some((value) => value === domain.verification_token)
            );

            if (verified) {
                // Update the domain as verified
                const { error: updateError } = await supabase
                    .from("domains")
                    .update({
                        verified: true,
                        verified_at: new Date().toISOString(),
                    })
                    .eq("id", domainId);

                if (updateError) {
                    throw updateError;
                }

                return new Response(
                    JSON.stringify({
                        success: true,
                        message: "Domain successfully verified",
                    }),
                    {
                        status: 200,
                        headers: { "Content-Type": "application/json" },
                    }
                );
            } else {
                return new Response(
                    JSON.stringify({
                        success: false,
                        error: "Verification token not found in DNS records",
                    }),
                    {
                        status: 400,
                        headers: { "Content-Type": "application/json" },
                    }
                );
            }
        } catch (error) {
            console.error("DNS verification error:", error);

            // Provide more specific error messages based on DNS error codes
            const dnsError = error as DnsError;
            let errorMessage = "Failed to query DNS records";

            if (dnsError.code === "ENODATA" || dnsError.code === "ENOTFOUND") {
                errorMessage =
                    "No DNS TXT records found. Please add the TXT record and try again.";
            } else if (dnsError.code === "ETIMEDOUT") {
                errorMessage = "DNS query timed out. Please try again later.";
            } else if (dnsError.code === "ESERVFAIL") {
                errorMessage =
                    "DNS server failure. Please check your domain's DNS configuration.";
            }

            return new Response(
                JSON.stringify({
                    success: false,
                    error: errorMessage,
                }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }
    } catch (err) {
        console.error("Unexpected error:", err);
        return new Response(
            JSON.stringify({
                success: false,
                error: "Internal server error",
            }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
