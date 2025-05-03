"use client";
import { useEffect, useState } from "react";
import SignOutButton from "./SignOutButton";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import {
    HomeIcon,
    PlusIcon,
    ChartBarIcon,
    BookOpenIcon,
} from "@heroicons/react/24/solid";
import { User } from "@supabase/supabase-js";

export default function Navbar() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getUser() {
            const { data } = await supabase.auth.getUser();
            setUser(data.user);
            setLoading(false);
        }
        getUser();
    }, []);

    if (loading) return null;

    return (
        <div className="bg-white/80 dark:bg-[#181824]/80 border-b border-white/30 dark:border-white/10 sticky top-0 z-10 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-400 bg-clip-text text-transparent">
                            {!loading && user && (
                                <>
                                    Welcome,{" "}
                                    {user.user_metadata.full_name ||
                                        user.user_metadata.name ||
                                        user.email}
                                </>
                            )}
                        </h1>
                    </div>

                    <div className="flex items-center space-x-4">
                        <nav className="flex items-center space-x-1 mr-4">
                            <Link
                                href="/dashboard"
                                className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                                <HomeIcon className="w-5 h-5" />
                            </Link>
                            <Link
                                href="/dashboard/analytics"
                                className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                                <ChartBarIcon className="w-5 h-5" />
                            </Link>
                            <Link
                                href="/dashboard/add-domain"
                                className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                                <PlusIcon className="w-5 h-5" />
                            </Link>
                            <Link
                                href="/docs"
                                className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                                <BookOpenIcon className="w-5 h-5" />
                            </Link>
                        </nav>
                        <SignOutButton />
                    </div>
                </div>
            </div>
        </div>
    );
}
