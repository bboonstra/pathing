"use client";

import Navbar from "@/components/Navbar";
import DocumentationNavbar from "@/components/DocumentationNavbar";

export default function DocsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-100 dark:from-[#0a0a0a] dark:via-[#181824] dark:to-[#1a1a2e] flex flex-col">
            {/* Main Navbar */}
            <Navbar />

            {/* Main content */}
            <div className="flex-grow flex flex-col items-center px-4 pt-6 pb-8">
                <div className="w-full max-w-4xl">{children}</div>
            </div>

            {/* Documentation secondary navbar */}
            <DocumentationNavbar />

            {/* Footer */}
            <footer className="w-full border-t border-gray-200 dark:border-gray-800 py-6 text-center text-gray-400 text-sm bg-white/60 dark:bg-black/20 backdrop-blur-md">
                &copy; {new Date().getFullYear()} pathing.cc &mdash; Easy
                analytics for humans.
            </footer>
        </div>
    );
}
