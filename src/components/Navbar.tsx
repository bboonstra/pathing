"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

type NavLink = {
    href: string;
    label: string;
    isExternal?: boolean;
};

export default function Navbar() {
    const pathname = usePathname();

    const allLinks: NavLink[] = [
        { href: "/", label: "Home" },
        { href: "/dashboard", label: "Dash" },
        { href: "/docs", label: "Docs" },
        { href: "/pricing", label: "Pricing" },
        { href: "/tos", label: "Terms" },
    ];

    // Filter out the current page from the navbar links
    const navLinks = allLinks.filter(
        (link) =>
            link.href !== pathname &&
            link.href.toLowerCase() !== pathname.toLowerCase()
    );

    return (
        <nav className="fixed top-0 left-0 right-0 z-50">
            <div className="max-w-5xl mx-auto px-2 flex flex-col items-center">
                <div className="flex items-center space-x-6 text-md font-medium px-10 pb-3 pt-2 bg-gray-800/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-b-2xl border-t-0">
                    {navLinks.map((link) =>
                        link.isExternal ? (
                            <a
                                key={link.href}
                                href={link.href}
                                className="text-white hover:text-blue-300 transition-colors flex items-center gap-1"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {link.label}
                            </a>
                        ) : (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-white hover:text-blue-300 transition-colors"
                            >
                                {link.label}
                            </Link>
                        )
                    )}
                </div>
            </div>
        </nav>
    );
}
