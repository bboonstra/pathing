"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function AuthCallbackHandler() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const handleAuth = async () => {
            const code = searchParams.get("code");
            if (code) {
                try {
                    const supabase = createClientComponentClient();
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
