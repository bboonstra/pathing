"use client";
import { useEffect, useState } from "react";
import SignOutButton from "./SignOutButton";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
    HomeIcon,
    PlusIcon,
    GlobeAltIcon,
    BookOpenIcon,
    ChatBubbleLeftRightIcon,
    CurrencyDollarIcon,
} from "@heroicons/react/24/solid";
import { User } from "@supabase/supabase-js";

const truncateName = (name: string, maxLength: number = 20) => {
    if (name.length <= maxLength) return name;
    return `${name.substring(0, maxLength)}...`;
};

export default function Navbar() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const pathname = usePathname();

    useEffect(() => {
        async function getUser() {
            const { data } = await supabase.auth.getUser();
            setUser(data.user);
            setLoading(false);
        }
        getUser();
    }, []);

    if (loading) return null;

    const isActive = (path: string) => {
        return pathname === path;
    };

    return (
        <div className="bg-white/80 dark:bg-[#181824]/80 border-b border-white/30 dark:border-white/10 sticky top-0 z-10 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <Link href="/">
                            <Image
                                src="/pathing.png"
                                alt="Pathing Logo"
                                width={32}
                                height={32}
                                className="mr-2"
                            />
                        </Link>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-400 bg-clip-text text-transparent hidden sm:inline-block">
                            {!loading && user && (
                                <>
                                    Welcome,{" "}
                                    {truncateName(
                                        user.user_metadata.full_name ||
                                            user.user_metadata.name ||
                                            user.email
                                    )}
                                </>
                            )}
                        </h1>
                    </div>

                    <div className="flex items-center space-x-4">
                        <nav className="flex items-center space-x-1 mr-4">
                            <Link
                                href="/dashboard"
                                className={`p-2 rounded-lg ${
                                    isActive("/dashboard")
                                        ? "bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400"
                                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                                }`}
                            >
                                <HomeIcon className="w-5 h-5" />
                            </Link>
                            <Link
                                href="/dashboard/domains"
                                className={`p-2 rounded-lg ${
                                    isActive("/dashboard/domains")
                                        ? "bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400"
                                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                                }`}
                            >
                                <GlobeAltIcon className="w-5 h-5" />
                            </Link>
                            <Link
                                href="/dashboard/add-domain"
                                className={`p-2 rounded-lg ${
                                    isActive("/dashboard/add-domain")
                                        ? "bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400"
                                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                                }`}
                            >
                                <PlusIcon className="w-5 h-5" />
                            </Link>
                            <Link
                                href="/docs"
                                className={`p-2 rounded-lg ${
                                    isActive("/docs")
                                        ? "bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400"
                                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                                }`}
                            >
                                <BookOpenIcon className="w-5 h-5" />
                            </Link>
                            <Link
                                href="/dashboard/feedback"
                                className={`p-2 rounded-lg ${
                                    isActive("/dashboard/feedback")
                                        ? "bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400"
                                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                                }`}
                            >
                                <ChatBubbleLeftRightIcon className="w-5 h-5" />
                            </Link>
                            <Link
                                href="/dashboard/pricing"
                                className={`p-2 rounded-lg ${
                                    isActive("/dashboard/pricing")
                                        ? "bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400"
                                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                                }`}
                            >
                                <CurrencyDollarIcon className="w-5 h-5" />
                            </Link>
                        </nav>
                        <SignOutButton />
                    </div>
                </div>
            </div>
        </div>
    );
}
