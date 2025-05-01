import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
    const body = await req.json();

    const { data, error } = await supabase
        .from("events")
        .insert([{ type: body.type, payload: body.payload }]);
    console.log("Event logged:", body);
    console.log("Insertion result:", data, error);

    return new Response(JSON.stringify({ success: !error }), {
        status: error ? 500 : 200,
    });
}
