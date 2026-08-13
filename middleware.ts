import { createServerClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
    const res = NextResponse.next();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    // NextRequest exposes cookies via `req.cookies` helpers
                    // `getAll` returns an array of { name, value }
                    // Fallback to empty array if not available
                    // @ts-ignore
                    return req.cookies?.getAll ? req.cookies.getAll() : [];
                },
                setAll(
                    cookiesToSet: Array<{
                        name: string;
                        value: string;
                        options?: Record<string, any>;
                    }>,
                ) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            res.cookies.set(name, value, options as any),
                        );
                    } catch {
                        // ignore
                    }
                },
            },
        },
    );
    await supabase.auth.getSession(); // attaches session to req.cookies
    return res;
}

export const config = {
    matcher: ["/dashboard/:path*"],
};
