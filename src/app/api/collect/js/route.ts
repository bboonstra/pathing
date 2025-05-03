import { readFileSync } from "fs";

import path from "path";

export async function GET() {
    try {
        // Read the pathing.js file from the public directory
        const filePath = path.resolve(process.cwd(), "public", "pathing.js");
        const fileContent = readFileSync(filePath, "utf8");

        // Return the JavaScript file with proper MIME type
        return new Response(fileContent, {
            headers: {
                "Content-Type": "application/javascript",
                "Cache-Control": "public, max-age=86400",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET",
                "Access-Control-Allow-Headers":
                    "X-Pathing-API-Key, Content-Type",
            },
        });
    } catch (error) {
        console.error("Error serving pathing.js:", error);
        return new Response("Error serving script", { status: 500 });
    }
}

// Add OPTIONS handler for CORS preflight requests
export async function OPTIONS() {
    return new Response(null, {
        status: 204,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET",
            "Access-Control-Allow-Headers": "X-Pathing-API-Key, Content-Type",
            "Access-Control-Max-Age": "86400",
        },
    });
}
