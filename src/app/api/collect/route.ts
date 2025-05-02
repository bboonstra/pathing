import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
    try {
        // Get the API key from headers
        const publicKey = req.headers.get("x-pathing-api-key");

        if (!publicKey) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: "Public key is required",
                }),
                {
                    status: 401,
                    headers: { "Content-Type": "application/json" },
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
                    headers: { "Content-Type": "application/json" },
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
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        // Parse and store the event
        const body = await req.json();

        const { error } = await supabase.from("events").insert([
            {
                type: body.type,
                payload: body.payload,
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
                    headers: { "Content-Type": "application/json" },
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
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "POST",
                    "Access-Control-Allow-Headers":
                        "X-Pathing-API-Key, Content-Type",
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
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}

// Add OPTIONS handler for CORS preflight requests
export async function OPTIONS() {
    return new Response(null, {
        status: 204,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST",
            "Access-Control-Allow-Headers": "X-Pathing-API-Key, Content-Type",
            "Access-Control-Max-Age": "86400",
        },
    });
}
