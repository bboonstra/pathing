import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// CORS headers to allow all origins
const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "X-Pathing-API-Key, Content-Type",
};

export async function POST(req: NextRequest) {
    try {
        // Get the API key from headers or query parameters
        const publicKey =
            req.headers.get("x-pathing-api-key") ||
            req.nextUrl.searchParams.get("pathing-api-key");

        if (!publicKey) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: "Public key is required",
                }),
                {
                    status: 401,
                    headers: {
                        "Content-Type": "application/json",
                        ...corsHeaders,
                    },
                }
            );
        }

        // Verify the public key exists in the database and domain is verified
        const { data: domain, error: domainError } = await supabase
            .from("domains")
            .select("id, name, verified")
            .eq("public_key", publicKey)
            .single();

        if (domainError || !domain) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: "Invalid public key",
                }),
                {
                    status: 401,
                    headers: {
                        "Content-Type": "application/json",
                        ...corsHeaders,
                    },
                }
            );
        }

        // Check if domain is verified
        if (!domain.verified) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: "Domain not verified. Please verify your domain ownership before collecting data.",
                }),
                {
                    status: 403,
                    headers: {
                        "Content-Type": "application/json",
                        ...corsHeaders,
                    },
                }
            );
        }

        // Parse and store the event
        const body = await req.json();

        const { error } = await supabase.from("events").insert([
            {
                type: body.type,
                payload: body.payload,
                metadata: body.metadata || {},
                device_info: body.deviceInfo || {},
                session_info: body.sessionInfo || {},
                domain_id: domain.id,
            },
        ]);

        if (error) {
            console.error("Event logging error:", error);
            return new Response(
                JSON.stringify({
                    success: false,
                    error: "Failed to log event",
                }),
                {
                    status: 500,
                    headers: {
                        "Content-Type": "application/json",
                        ...corsHeaders,
                    },
                }
            );
        }

        return new Response(
            JSON.stringify({
                success: true,
            }),
            {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                    ...corsHeaders,
                },
            }
        );
    } catch (err) {
        console.error("Unexpected error:", err);
        return new Response(
            JSON.stringify({
                success: false,
                error: "Internal server error",
            }),
            {
                status: 500,
                headers: { "Content-Type": "application/json", ...corsHeaders },
            }
        );
    }
}

// Add OPTIONS handler for CORS preflight requests
export async function OPTIONS() {
    return new Response(null, {
        status: 204,
        headers: corsHeaders,
    });
}
