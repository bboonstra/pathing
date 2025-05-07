"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeftIcon, ChartBarIcon } from "@heroicons/react/24/solid";
import Navbar from "@/components/Navbar";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function NotFound() {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            // Check login state
            supabase.auth.getUser().then(({ data }) => {
                setIsLoggedIn(!!data.user);
            });
        }
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-100 dark:from-[#0a0a0a] dark:via-[#181824] dark:to-[#1a1a2e] text-[var(--foreground)] font-sans p-4">
            {/* Navbar */}
            <Navbar />

            <div className="flex-1 flex items-center justify-center">
                <div className="text-center max-w-lg mx-auto">
                    <div className="mb-8 flex justify-center">
                        <Image
                            src="/pathing.png"
                            alt="Pathing Logo"
                            width={80}
                            height={80}
                            className="opacity-80"
                        />
                    </div>

                    <h1 className="text-4xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-blue-600 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
                        404
                    </h1>

                    <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800 dark:text-gray-200">
                        Looks like you&apos;ve lost your path!
                    </h2>

                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                        The page you&apos;re looking for doesn&apos;t exist or
                        has been moved.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/"
                            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 animated-gradient text-white font-medium rounded-full shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300/50"
                        >
                            <ArrowLeftIcon className="w-4 h-4 mr-2" />
                            Back to Home
                        </Link>

                        {isLoggedIn && (
                            <Link
                                href="/dashboard"
                                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 animated-gradient text-white font-medium rounded-full shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-300/50"
                            >
                                <ChartBarIcon className="w-4 h-4 mr-2" />
                                Go to Dashboard
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .animated-gradient {
                    background-size: 200% 200%;
                    background-position: 0% 50%;
                    transition: background-position 0.5s ease-in-out;
                }

                .animated-gradient:hover {
                    background-position: 100% 50%;
                }
            `}</style>
        </div>
    );
}
