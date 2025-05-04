"use client";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { ArrowLeftOnRectangleIcon } from "@heroicons/react/24/solid";

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
            className="ml-auto bg-gradient-to-r from-blue-600 via-purple-600 to-blue-400 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-full shadow-md transition-all focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-60 px-2 py-2 sm:px-6 sm:py-2 flex items-center justify-center"
            aria-label="Sign out"
        >
            <ArrowLeftOnRectangleIcon className="w-5 h-5 sm:hidden" />
            <span className="hidden sm:inline">
                {loading ? "Signing out..." : "Sign Out"}
            </span>
        </button>
    );
}
