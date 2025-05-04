"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
    CheckCircleIcon,
    BoltIcon,
    EyeIcon,
    ShieldCheckIcon,
    ArrowRightIcon,
    ClipboardIcon,
} from "@heroicons/react/24/solid";
import { supabase } from "@/lib/supabase";
import { pathing } from "pathingjs";
import HomepageAnalytics from "@/components/HomepageAnalytics";
import BetaBadge from "@/components/BetaBadge";

export default function Home() {
    const [eventSent, setEventSent] = useState(false);
    const [copied, setCopied] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [codeSnippet, setCodeSnippet] = useState(
        '<script src="/pathing.js"></script>'
    );
    // Reference to the button
    const [demoButtonRef, setDemoButtonRef] =
        useState<HTMLButtonElement | null>(null);
    // State to control analytics visibility
    const [showAnalytics, setShowAnalytics] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            setCodeSnippet(
                `<script src="${window.location.origin}/pathing.js" pathing-api-key="pk_[YOUR_API_KEY]"></script>`
            );
        }
    }, []);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setIsLoggedIn(!!session);
        });
        const { data: listener } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setIsLoggedIn(!!session);
            }
        );
        return () => {
            listener?.subscription.unsubscribe();
        };
    }, []);

    // Use pathing.link.button when the demo button is available
    useEffect(() => {
        if (demoButtonRef) {
            // Link the button to an analytics event
            pathing.link.button(demoButtonRef, {
                location: "homepage",
                action: "demo_click",
                buttonId: "demo-button",
            });
        }
    }, [demoButtonRef]);

    function handleCopy() {
        navigator.clipboard.writeText(codeSnippet);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
    }

    const handleDemoClick = () => {
        setEventSent(true);

        // Show analytics after a short delay
        setTimeout(() => {
            setShowAnalytics(true);
        }, 1000);
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-100 dark:from-[#0a0a0a] dark:via-[#181824] dark:to-[#1a1a2e] text-[var(--foreground)] font-sans transition-colors duration-500">
            {/* Hero */}
            <header className="flex-1 flex flex-col items-center justify-center px-4 pt-32 pb-16 text-center relative">
                <div className="absolute inset-0 pointer-events-none z-0">
                    <div className="w-72 h-72 bg-gradient-to-tr from-blue-400/10 via-purple-400/10 to-transparent rounded-full blur-2xl absolute -top-20 -left-20" />
                </div>
                <div className="flex items-center justify-center mb-6">
                    <Image
                        src="/pathing.png"
                        alt="Pathing Logo"
                        width={72}
                        height={72}
                        className="m-0 p-0"
                    />
                    <h1 className="relative z-10 text-5xl sm:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-blue-400 bg-clip-text text-transparent drop-shadow-lg">
                        pathing<span className="text-blue-500">.cc</span>
                    </h1>
                    <BetaBadge />
                </div>
                <h2 className="relative z-10 text-2xl sm:text-3xl font-semibold mb-6 text-gray-700 dark:text-gray-200">
                    Walk the path your users take.
                </h2>
                <p className="relative z-10 max-w-2xl mx-auto mb-10 text-lg sm:text-xl text-gray-500 dark:text-gray-400 font-medium">
                    Effortless, privacy-first analytics. Instantly understand
                    user journeys—no bloat, no cookies, just clarity.
                </p>
                <div className="relative z-10 flex flex-col sm:flex-row gap-4 justify-center mb-8">
                    {isLoggedIn ? (
                        <a
                            href="/dashboard"
                            className="group bg-gradient-to-r from-blue-600 via-purple-600 to-blue-400 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-10 py-4 rounded-full shadow-xl transition-all text-lg flex items-center gap-2 focus:outline-none focus:ring-4 focus:ring-blue-300"
                        >
                            Go to Dashboard{" "}
                            <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </a>
                    ) : (
                        <a
                            href="/login"
                            className="group bg-gradient-to-r from-blue-600 via-purple-600 to-blue-400 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-10 py-4 rounded-full shadow-xl transition-all text-lg flex items-center gap-2 focus:outline-none focus:ring-4 focus:ring-blue-300"
                        >
                            Sign Up / Log In{" "}
                            <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </a>
                    )}
                    <a
                        href="https://github.com/bboonstra/pathing"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border-2 border-blue-600 text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 font-bold px-10 py-4 rounded-full transition-all text-lg flex items-center gap-2 focus:outline-none focus:ring-4 focus:ring-blue-200"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.73 1.27 3.4.97.11-.75.41-1.27.74-1.56-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 2.9-.39c.98 0 1.97.13 2.9.39 2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.69 5.41-5.25 5.7.42.36.79 1.09.79 2.2 0 1.59-.01 2.87-.01 3.26 0 .31.21.68.8.56C20.71 21.39 24 17.08 24 12c0-6.27-5.23-11.5-12-11.5z" />
                        </svg>
                        View on GitHub
                    </a>
                </div>
            </header>

            {/* Value Props */}
            <section className="max-w-5xl mx-auto grid sm:grid-cols-3 gap-8 px-4 mb-10 relative z-10">
                <div className="backdrop-blur-lg bg-white/60 dark:bg-white/10 rounded-2xl p-8 shadow-xl text-center border border-white/40 dark:border-white/10 flex flex-col items-center gap-3">
                    <BoltIcon className="w-8 h-8 text-blue-500 mb-2" />
                    <h3 className="font-extrabold text-lg mb-1">
                        1-line Install
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 font-medium">
                        Drop a script. Done. No config, no fuss.
                    </p>
                </div>
                <div className="backdrop-blur-lg bg-white/60 dark:bg-white/10 rounded-2xl p-8 shadow-xl text-center border border-white/40 dark:border-white/10 flex flex-col items-center gap-3">
                    <ShieldCheckIcon className="w-8 h-8 text-purple-500 mb-2" />
                    <h3 className="font-extrabold text-lg mb-1">
                        Privacy First
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 font-medium">
                        No cookies, no tracking pixels, no creepy stuff.
                    </p>
                </div>
                <div className="backdrop-blur-lg bg-white/60 dark:bg-white/10 rounded-2xl p-8 shadow-xl text-center border border-white/40 dark:border-white/10 flex flex-col items-center gap-3">
                    <EyeIcon className="w-8 h-8 text-blue-400 mb-2" />
                    <h3 className="font-extrabold text-lg mb-1">
                        Crystal Clear
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 font-medium">
                        See every step your users take, instantly.
                    </p>
                </div>
            </section>

            {/* Minimalist Scroll Indicator */}
            <div className="flex justify-center mb-10">
                <div
                    className="w-5 h-10 flex flex-col items-center cursor-pointer"
                    onClick={() =>
                        window.scrollTo({
                            top:
                                (document.getElementById("get-started")
                                    ?.offsetTop ?? 0) - 20,
                            behavior: "smooth",
                        })
                    }
                >
                    <span className="w-0.5 h-5 bg-gray-400/50 dark:bg-gray-500/50"></span>
                    <svg
                        className="w-5 h-5 text-gray-400/70 dark:text-gray-500/70 animate-pulse"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                </div>
            </div>

            {/* How it works */}
            <section
                id="get-started"
                className="max-w-2xl mx-auto px-4 mb-20 mt-15"
            >
                <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center">
                    Add analytics in seconds
                </h2>
                <div className="bg-white dark:bg-gray-900 rounded-xl p-4 sm:p-6 font-mono shadow-lg border border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row sm:items-start gap-3">
                    <div className="relative w-full overflow-hidden">
                        <pre className="bg-gray-100 dark:bg-gray-800 rounded p-3 text-sm sm:text-base text-blue-700 dark:text-blue-200 overflow-x-auto whitespace-pre-wrap break-all sm:whitespace-pre sm:break-normal max-w-full">
                            <code>{codeSnippet}</code>
                        </pre>
                    </div>
                    <button
                        className={`self-center sm:self-center flex-shrink-0 px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                            copied
                                ? "bg-green-500 text-white"
                                : "bg-blue-600 hover:bg-blue-700 text-white"
                        }`}
                        onClick={handleCopy}
                        aria-label="Copy code"
                    >
                        {copied ? (
                            <span className="flex items-center gap-1">
                                <CheckCircleIcon className="w-5 h-5 animate-pop" />{" "}
                                Copied!
                            </span>
                        ) : (
                            <span className="flex items-center gap-1">
                                <ClipboardIcon className="w-5 h-5" /> Copy
                            </span>
                        )}
                    </button>
                </div>

                <p className="text-gray-500 dark:text-gray-400 mt-3 text-center">
                    Paste this before your{" "}
                    <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">
                        &lt;/body&gt;
                    </code>{" "}
                    tag.
                </p>
            </section>

            {/* Demo event */}
            <section className="max-w-2xl mx-auto px-4 mb-28 text-center">
                <h2 className="text-2xl font-bold mb-4">See it in action</h2>
                <div className="flex justify-center flex-col items-center">
                    {/* Animated container that expands to show analytics */}
                    <div
                        className={`transition-all duration-700 ease-in-out transform 
                        ${
                            showAnalytics
                                ? "opacity-100 scale-100 mt-8 max-h-none"
                                : "opacity-0 scale-80 max-h-0 overflow-hidden pointer-events-none absolute"
                        }`}
                    >
                        <HomepageAnalytics />

                        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 p-5 rounded-lg border border-blue-100 dark:border-blue-800 text-left">
                            <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                                This is just a taste of what Pathing offers
                            </h3>
                            <p className="text-gray-700 dark:text-gray-300 mb-3">
                                What you&apos;re seeing above is real-time
                                analytics displaying demo button clicks across
                                all our users. With Pathing on your site,
                                you&apos;ll get:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
                                <li>
                                    User journeys and page flows visualized in
                                    intuitive charts
                                </li>
                                <li>
                                    Real-time event tracking with zero cookie
                                    usage
                                </li>
                                <li>Detailed device and session analytics</li>
                                <li>
                                    Custom event tracking for buttons, forms,
                                    and more
                                </li>
                            </ul>
                            <div className="mt-4">
                                <a
                                    href="/dashboard"
                                    className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium hover:text-blue-800 dark:hover:text-blue-300"
                                >
                                    Get started for free
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 ml-1"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Button container with conditional rendering */}
                    <div
                        className={`transition-all duration-500 ease-in-out ${
                            showAnalytics
                                ? "max-h-0 opacity-0 scale-95 mb-0 overflow-hidden"
                                : "max-h-20 opacity-100 scale-100 mb-4"
                        }`}
                    >
                        <button
                            ref={setDemoButtonRef}
                            className={`px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-400 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-full shadow-xl transition-all text-lg flex items-center justify-center gap-2 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-60 ${
                                eventSent && !showAnalytics ? "scale-105" : ""
                            }`}
                            id="demo-button"
                            onClick={handleDemoClick}
                            disabled={eventSent}
                        >
                            {eventSent ? (
                                <span className="flex items-center gap-2">
                                    <CheckCircleIcon className="w-6 h-6 animate-pop" />{" "}
                                    Event Sent!
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    Send Demo Event
                                </span>
                            )}
                        </button>
                    </div>
                </div>
                <div
                    className={`mt-4 text-gray-500 dark:text-gray-400 text-base transition-opacity duration-500 ${
                        showAnalytics ? "opacity-0" : "opacity-100"
                    }`}
                >
                    {eventSent
                        ? "Demo event sent! Loading real analytics..."
                        : "Click to send a test event and see analytics in action."}
                </div>
            </section>

            {/* Documentation CTA */}
            <section className="max-w-4xl mx-auto px-4 mb-20">
                <div className="backdrop-blur-lg bg-white/70 dark:bg-white/10 rounded-2xl p-8 sm:p-10 shadow-xl border border-white/40 dark:border-white/10 flex flex-col items-center text-center">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-400 bg-clip-text text-transparent">
                        Ready to dive deeper?
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300 text-lg max-w-2xl mb-8">
                        Our comprehensive documentation covers everything from
                        basic setup to advanced tracking strategies. Learn how
                        to make the most of Pathing with our code examples, API
                        reference, and best practices.
                    </p>
                    <a
                        href="/docs"
                        className="group bg-gradient-to-r from-blue-600 via-purple-600 to-blue-400 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-10 py-4 rounded-full shadow-xl transition-all text-lg flex items-center gap-2 focus:outline-none focus:ring-4 focus:ring-blue-300"
                    >
                        Explore the Docs{" "}
                        <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </a>
                </div>
            </section>

            {/* Footer */}
            <footer className="w-full border-t border-gray-200 dark:border-gray-800 py-8 text-center text-gray-400 text-base bg-white/60 dark:bg-black/20 backdrop-blur-md">
                &copy; {new Date().getFullYear()} pathing.cc &mdash; Easy
                analytics for humans.
            </footer>
            <style jsx global>{`
                @keyframes pop {
                    0% {
                        transform: scale(0.8);
                        opacity: 0.5;
                    }
                    60% {
                        transform: scale(1.2);
                        opacity: 1;
                    }
                    100% {
                        transform: scale(1);
                        opacity: 1;
                    }
                }
                .animate-pop {
                    animation: pop 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                }
            `}</style>
        </div>
    );
}
