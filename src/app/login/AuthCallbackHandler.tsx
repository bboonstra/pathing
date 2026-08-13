"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createBrowserClient } from "@supabase/auth-helpers-nextjs";

export default function AuthCallbackHandler() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const handleAuth = async () => {
            const code = searchParams.get("code");
            if (code) {
                try {
                    const supabase = createBrowserClient(
                        process.env.NEXT_PUBLIC_SUPABASE_URL!,
                        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                    );
                    await supabase.auth.exchangeCodeForSession(code);
                    window.close();
                } catch (error) {
                    console.error("Auth error:", error);
                }
            }
        };
        handleAuth();
    }, [searchParams, router]);

    return null;
}
