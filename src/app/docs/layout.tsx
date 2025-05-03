"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    BookOpenIcon,
    CodeBracketIcon,
    BeakerIcon,
    Bars3Icon,
    XMarkIcon,
    HomeIcon,
} from "@heroicons/react/24/solid";

export default function DocsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    // Helper to check if a link is active
    const isActive = (path: string) => {
        if (path === "/docs") {
            return pathname === "/docs";
        }
        return pathname.startsWith(path);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-100 dark:from-[#0a0a0a] dark:via-[#181824] dark:to-[#1a1a2e] flex flex-col">
            {/* Navbar */}
            <nav className="bg-white/80 dark:bg-[#181824]/80 border-b border-white/30 dark:border-white/10 sticky top-0 z-10 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <Link href="/" className="flex items-center">
                                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-400 bg-clip-text text-transparent">
                                    pathing
                                    <span className="text-blue-500">.cc</span>
                                    <span className="bg-gradient-to-r from-gray-500 to-purple-900 bg-clip-text text-transparent">
                                        &nbsp;Docs
                                    </span>
                                </h1>
                            </Link>
                        </div>

                        {/* Desktop menu */}
                        <div className="hidden md:flex items-center space-x-2">
                            <Link
                                href="/docs"
                                className={`p-2 rounded-lg flex items-center gap-1.5 transition-colors ${
                                    isActive("/docs") &&
                                    !pathname.includes("/api") &&
                                    !pathname.includes("/examples")
                                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium"
                                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                                }`}
                            >
                                <BookOpenIcon className="w-5 h-5" />
                                <span>Docs</span>
                            </Link>
                            <Link
                                href="/docs/api"
                                className={`p-2 rounded-lg flex items-center gap-1.5 transition-colors ${
                                    isActive("/docs/api")
                                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium"
                                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                                }`}
                            >
                                <CodeBracketIcon className="w-5 h-5" />
                                <span>API</span>
                            </Link>
                            <Link
                                href="/docs/examples"
                                className={`p-2 rounded-lg flex items-center gap-1.5 transition-colors ${
                                    isActive("/docs/examples")
                                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium"
                                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                                }`}
                            >
                                <BeakerIcon className="w-5 h-5" />
                                <span>Examples</span>
                            </Link>
                            <Link
                                href="/dashboard"
                                className="p-2 rounded-lg flex items-center gap-1.5 transition-colors text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                                <HomeIcon className="w-5 h-5" />
                                <span>Dashboard</span>
                            </Link>
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden">
                            <button
                                type="button"
                                className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
                                onClick={() =>
                                    setMobileMenuOpen(!mobileMenuOpen)
                                }
                            >
                                {mobileMenuOpen ? (
                                    <XMarkIcon
                                        className="h-6 w-6"
                                        aria-hidden="true"
                                    />
                                ) : (
                                    <Bars3Icon
                                        className="h-6 w-6"
                                        aria-hidden="true"
                                    />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden bg-white/95 dark:bg-[#181824]/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            <Link
                                href="/docs"
                                className={`block p-3 rounded-lg flex items-center gap-1.5 transition-colors ${
                                    isActive("/docs") &&
                                    !pathname.includes("/api") &&
                                    !pathname.includes("/examples")
                                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium"
                                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                                }`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <BookOpenIcon className="w-5 h-5" />
                                <span>Docs</span>
                            </Link>
                            <Link
                                href="/docs/api"
                                className={`block p-3 rounded-lg flex items-center gap-1.5 transition-colors ${
                                    isActive("/docs/api")
                                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium"
                                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                                }`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <CodeBracketIcon className="w-5 h-5" />
                                <span>API</span>
                            </Link>
                            <Link
                                href="/docs/examples"
                                className={`block p-3 rounded-lg flex items-center gap-1.5 transition-colors ${
                                    isActive("/docs/examples")
                                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium"
                                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                                }`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <BeakerIcon className="w-5 h-5" />
                                <span>Examples</span>
                            </Link>
                            <Link
                                href="/dashboard"
                                className="block p-3 rounded-lg flex items-center gap-1.5 transition-colors text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <HomeIcon className="w-5 h-5" />
                                <span>Dashboard</span>
                            </Link>
                        </div>
                    </div>
                )}
            </nav>

            {/* Main content */}
            <div className="flex-grow flex flex-col items-center py-8 px-4">
                <div className="w-full max-w-4xl">{children}</div>
            </div>

            {/* Footer */}
            <footer className="w-full border-t border-gray-200 dark:border-gray-800 py-6 text-center text-gray-400 text-sm bg-white/60 dark:bg-black/20 backdrop-blur-md">
                &copy; {new Date().getFullYear()} pathing.cc &mdash; Easy
                analytics for humans.
            </footer>
        </div>
    );
}
