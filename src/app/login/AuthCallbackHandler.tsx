"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function AuthCallbackHandler() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const code = searchParams.get("code");

    useEffect(() => {
        const handleAuth = async () => {
            if (code) {
                const supabase = createClientComponentClient();
                await supabase.auth.exchangeCodeForSession(code);
                router.replace("/dashboard");
            }
        };
        handleAuth();
    }, [code, router]);

    return null;
}
