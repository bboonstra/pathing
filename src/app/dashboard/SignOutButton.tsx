"use client";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useState } from "react";

export default function SignOutButton() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleSignOut = async () => {
        setLoading(true);
        await supabase.auth.signOut();
        router.replace("/");
    };

    return (
        <button
            onClick={handleSignOut}
            disabled={loading}
            className="ml-auto bg-gradient-to-r from-blue-600 via-purple-600 to-blue-400 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-6 py-2 rounded-full shadow-md transition-all text-base focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-60"
            aria-label="Sign out"
        >
            {loading ? "Signing out..." : "Sign Out"}
        </button>
    );
}
