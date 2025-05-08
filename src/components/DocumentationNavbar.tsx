"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    BookOpenIcon,
    CodeBracketIcon,
    BeakerIcon,
} from "@heroicons/react/24/solid";

export default function DocumentationNavbar() {
    const pathname = usePathname();

    // Helper to check if a link is active
    const isActive = (path: string) => {
        if (path === "/docs") {
            return pathname === "/docs";
        }
        return pathname.startsWith(path);
    };

    return (
        <div className="w-full bg-white/80 dark:bg-[#181824]/80 border-t border-white/30 dark:border-white/10 sticky bottom-0 z-20 backdrop-blur-sm">
            <div className="max-w-5xl mx-auto px-4">
                <div className="flex items-center h-14 overflow-x-auto">
                    <Link
                        href="/docs"
                        className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                            isActive("/docs") &&
                            !pathname.includes("/api") &&
                            !pathname.includes("/examples")
                                ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium"
                                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                    >
                        <BookOpenIcon className="w-4 h-4" />
                        <span>Getting Started</span>
                    </Link>
                    <Link
                        href="/docs/api"
                        className={`ml-2 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                            isActive("/docs/api")
                                ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium"
                                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                    >
                        <CodeBracketIcon className="w-4 h-4" />
                        <span>API Reference</span>
                    </Link>
                    <Link
                        href="/docs/examples"
                        className={`ml-2 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                            isActive("/docs/examples")
                                ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium"
                                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                    >
                        <BeakerIcon className="w-4 h-4" />
                        <span>Examples</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
