"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
    CheckCircleIcon,
    BoltIcon,
    EyeIcon,
    ShieldCheckIcon,
    ArrowRightIcon,
} from "@heroicons/react/24/solid";
import { supabase } from "@/lib/supabase";
import { pathing } from "pathingjs";
import HomepageAnalytics from "@/components/analytica/HomepageAnalytics";
import EventTimelineChart from "@/components/analytica/EventTimelineChart";
import Navbar from "@/components/Navbar";
import type { EventData } from "@/components/analytica/EventTimelineChart";
import CopyButton from "@/components/CopyButton";

export default function Home() {
    const [eventSent, setEventSent] = useState(false);
    const [codeSnippet, setCodeSnippet] = useState(
        '<script src="/pathing.js" pathing-api-key="pk_[YOUR_API_KEY]"></script>'
    );
    // Reference to the button
    const [demoButtonRef, setDemoButtonRef] =
        useState<HTMLButtonElement | null>(null);
    // State to control analytics visibility
    const [showAnalytics, setShowAnalytics] = useState(false);
    // Add state for user login
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
    // Add state for dummy events
    const [dummyEvents, setDummyEvents] = useState<EventData[]>([]);

    useEffect(() => {
        // Fetch dummy events from API
        fetch("/api/dummy-events")
            .then((res) => res.json())
            .then((data) => {
                setDummyEvents(data.events);
            })
            .catch((err) => console.error("Error fetching dummy events:", err));
    }, []);

    useEffect(() => {
        // Only run on client side
        const updateCodeSnippet = () => {
            setCodeSnippet(
                `<script src="${window.location.origin}/pathing.js" pathing-api-key="pk_[YOUR_API_KEY]"></script>`
            );
        };
        updateCodeSnippet();

        // Check login state
        supabase.auth.getUser().then(({ data }) => {
            setIsLoggedIn(!!data.user);
        });
    }, []);

    useEffect(() => {
        pathing.init(process.env.NEXT_PUBLIC_PATHING_API_KEY);
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
            <header className="min-h-screen flex flex-col items-center justify-center px-4 pt-20 pb-16 text-center relative overflow-hidden">
                {/* Navbar */}
                <Navbar />

                {/* Background Chart - Hidden on mobile */}
                <div className="absolute inset-0 w-full h-full z-0 opacity-70 hidden sm:flex items-end justify-center">
                    <div className="w-full h-[40vh] flex items-end p-4">
                        <EventTimelineChart
                            events={dummyEvents}
                            timeFrame="30d"
                            isLoading={false}
                            hideBoundingBox={true}
                            hideTooltip={true}
                        />
                    </div>
                </div>

                {/* Overlay gradient to improve text readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/80 to-white/95 dark:from-[#0a0a0a]/95 dark:via-[#181824]/85 dark:to-[#1a1a2e]/90 z-1"></div>

                {/* Content */}
                <div className="flex-1 flex flex-col items-center justify-center z-10 text-center max-w-3xl">
                    <div className="flex items-center justify-center mb-8 w-full">
                        <Image
                            src="/pathing.png"
                            alt="Pathing Logo"
                            width={64}
                            height={64}
                            className="m-0 p-0"
                        />
                        <h1 className="font-headline text-5xl sm:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-purple-500 to-indigo-500 bg-clip-text text-transparent ml-3 pb-1">
                            pathing
                            <span className="text-indigo-600 dark:text-purple-400 opacity-90 font-semibold">
                                .cc
                            </span>
                        </h1>
                    </div>
                    <h2 className="font-headline text-2xl sm:text-3xl font-semibold mb-6 text-gray-700 dark:text-gray-200 w-full">
                        Walk the path your users take.
                    </h2>
                    <p className="max-w-xl mb-10 text-lg sm:text-xl text-gray-500 dark:text-gray-400 font-medium w-full">
                        Effortless, privacy-first analytics with a complex
                        dashboard to help you understand your users.
                    </p>
                    <a
                        href="/dashboard"
                        className="inline-block px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 animated-gradient text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-lg focus:outline-none focus:ring-4 focus:ring-blue-300/50 animate-fadeInUp"
                        style={{ animationDelay: "0.2s" }}
                    >
                        {isLoggedIn === null
                            ? "Get Started Free"
                            : isLoggedIn
                            ? "Go to Dashboard"
                            : "Get Started Free"}
                    </a>
                </div>

                {/* Scroll Indicator - Fixed at bottom */}
                <div className="absolute bottom-6 left-0 right-0 flex flex-col items-center z-20">
                    <p
                        className="text-gray-700 dark:text-gray-200 mb-2 text-sm font-semibold bg-white/90 dark:bg-gray-900/90 px-4 py-2 rounded-full backdrop-blur-sm shadow-sm cursor-pointer hover:bg-white dark:hover:bg-gray-900"
                        onClick={() =>
                            window.scrollTo({
                                top:
                                    (document.getElementById("demo-section")
                                        ?.offsetTop ?? 0) - 20,
                                behavior: "smooth",
                            })
                        }
                    >
                        See the demo
                    </p>
                    <div
                        className="cursor-pointer"
                        onClick={() =>
                            window.scrollTo({
                                top:
                                    (document.getElementById("demo-section")
                                        ?.offsetTop ?? 0) - 20,
                                behavior: "smooth",
                            })
                        }
                    >
                        <svg
                            className="w-5 h-5 text-blue-500 dark:text-blue-400"
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
            </header>

            {/* Demo Section */}
            <section
                id="demo-section"
                className="max-w-4xl mx-auto px-4 mb-16 mt-16 pt-10"
            >
                <div className="text-center mb-2">
                    <h2 className="text-3xl sm:text-4xl font-extrabold mb-3 bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
                        Experience Pathing in Action
                    </h2>
                </div>

                <div className="p-2 text-center animate-fadeInUp transform transition-all">
                    <p className="text-lg text-gray-700 dark:text-gray-200 mb-6">
                        Click the button below to send a demo event and watch
                        the analytics update in real-time!
                    </p>
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
                                    analytics displaying demo button clicks
                                    across all our users. With Pathing on your
                                    site, you&apos;ll get:
                                </p>
                                <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
                                    <li>
                                        User journeys and page flows visualized
                                        in intuitive charts
                                    </li>
                                    <li>
                                        Real-time event tracking with zero
                                        cookie usage
                                    </li>
                                    <li>
                                        Detailed device and session analytics
                                    </li>
                                    <li>
                                        Custom event tracking for buttons,
                                        forms, and more
                                    </li>
                                </ul>
                                <div className="mt-4">
                                    <a
                                        href="/dashboard"
                                        className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium hover:text-blue-800 dark:hover:text-blue-300"
                                    >
                                        {isLoggedIn === null
                                            ? "Get started for free"
                                            : isLoggedIn
                                            ? "Go to Dashboard"
                                            : "Get started for free"}
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
                                className={`px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 animated-gradient text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-lg flex items-center justify-center gap-2 focus:outline-none focus:ring-4 focus:ring-blue-300/50 disabled:opacity-60 animate-fadeInUp`}
                                id="demo-button"
                                onClick={handleDemoClick}
                                disabled={eventSent}
                                style={{ animationDelay: "0.2s" }}
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
                            : ""}
                    </div>
                </div>
            </section>

            {/* Value Props */}
            <section className="max-w-5xl mx-auto grid sm:grid-cols-3 gap-8 px-4 mb-16 relative z-10">
                <div
                    className="card flex flex-col items-center gap-3 animate-fadeInUp"
                    style={{ animationDelay: "0.1s" }}
                >
                    <BoltIcon className="w-8 h-8 text-blue-500 mb-2" />
                    <h3 className="font-headline font-extrabold text-lg mb-1">
                        1-line Install
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 font-medium">
                        Drop a script. Done. No config, no fuss.
                    </p>
                </div>
                <div
                    className="card flex flex-col items-center gap-3 animate-fadeInUp"
                    style={{ animationDelay: "0.2s" }}
                >
                    <ShieldCheckIcon className="w-8 h-8 text-purple-500 mb-2" />
                    <h3 className="font-headline font-extrabold text-lg mb-1">
                        Privacy First
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 font-medium">
                        No popups, no tracking pixels, no creepy stuff.
                    </p>
                </div>
                <div
                    className="card flex flex-col items-center gap-3 animate-fadeInUp"
                    style={{ animationDelay: "0.3s" }}
                >
                    <EyeIcon className="w-8 h-8 text-blue-400 mb-2" />
                    <h3 className="font-headline font-extrabold text-lg mb-1">
                        Crystal Clear
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 font-medium">
                        See every step your users take, instantly.
                    </p>
                </div>
            </section>

            {/* Beta Section */}
            <section className="max-w-3xl mx-auto px-4 mb-16">
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl p-6 text-center shadow-md animate-fadeInUp">
                    <span className="inline-block bg-yellow-400 text-yellow-900 font-bold px-3 py-1 rounded-full text-xs mb-2">
                        Beta
                    </span>
                    <h2 className="text-xl font-bold mb-2">
                        Pathing is in Open Beta!
                    </h2>
                    <p className="text-gray-700 dark:text-gray-200">
                        We&apos;re actively improving Pathing based on your
                        feedback. Try it out and let us know what you think!
                    </p>
                </div>
            </section>

            {/* How it Works - Timeline style */}
            <section className="max-w-4xl mx-auto px-4 mb-16">
                <h2 className="font-headline text-2xl sm:text-3xl font-bold mb-10 text-center animate-fadeInUp">
                    How it Works
                </h2>
                <ol className="relative border-l-2 border-blue-200 dark:border-blue-900 pl-8">
                    <li
                        className="mb-12 animate-fadeInUp"
                        style={{ animationDelay: "0.1s" }}
                    >
                        <div className="absolute -left-5 top-1.5 w-4 h-4 bg-blue-500 rounded-full border-4 border-white dark:border-[#181824]"></div>
                        <h3 className="font-headline font-semibold text-lg mb-1">
                            Add the Script
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            Paste a single line before{" "}
                            <code>&lt;/body&gt;</code> on your site.
                        </p>
                    </li>
                    <li
                        className="mb-12 animate-fadeInUp"
                        style={{ animationDelay: "0.2s" }}
                    >
                        <div className="absolute -left-5 top-1.5 w-4 h-4 bg-purple-500 rounded-full border-4 border-white dark:border-[#181824]"></div>
                        <h3 className="font-headline font-semibold text-lg mb-1">
                            See Data Instantly
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            Real-time user journeys and events appear in your
                            dashboard.
                        </p>
                    </li>
                    <li
                        className="animate-fadeInUp"
                        style={{ animationDelay: "0.3s" }}
                    >
                        <div className="absolute -left-5 top-1.5 w-4 h-4 bg-blue-400 rounded-full border-4 border-white dark:border-[#181824]"></div>
                        <h3 className="font-headline font-semibold text-lg mb-1">
                            Act on Insights
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            Use clear analytics to improve UX, conversion, and
                            retention.
                        </p>
                    </li>
                </ol>
            </section>

            {/* How it works */}
            <section id="get-started" className="max-w-2xl mx-auto px-4 mb-16">
                <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center">
                    Add analytics in seconds
                </h2>
                <div className="bg-white dark:bg-gray-900 rounded-xl p-4 sm:p-6 font-mono shadow-lg border border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row sm:items-start gap-3">
                    <div className="relative w-full overflow-hidden">
                        <pre className="bg-gray-100 dark:bg-gray-800 rounded p-3 text-sm sm:text-base text-blue-700 dark:text-blue-200 overflow-x-auto whitespace-pre-wrap break-all sm:whitespace-pre sm:break-normal max-w-full">
                            <code>{codeSnippet}</code>
                        </pre>
                    </div>
                    <CopyButton
                        text={codeSnippet}
                        className="self-center sm:self-center flex-shrink-0 px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-600 hover:bg-blue-700 text-white"
                        iconClassName="w-5 h-5"
                        showText={true}
                        defaultText="Copy"
                        successText="Copied!"
                    />
                </div>

                <p className="text-gray-500 dark:text-gray-400 mt-3 text-center">
                    Paste this before your{" "}
                    <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">
                        &lt;/body&gt;
                    </code>{" "}
                    tag.
                </p>
            </section>

            {/* Documentation CTA */}
            <section className="max-w-4xl mx-auto px-4 mb-16">
                <div className="backdrop-blur-lg bg-white/70 dark:bg-white/10 rounded-2xl p-8 sm:p-10 shadow-xl border border-white/40 dark:border-white/10 flex flex-col items-center text-center">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
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
                        className="group bg-gradient-to-r from-blue-500 to-indigo-600 animated-gradient text-white font-bold px-10 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-lg flex items-center gap-2 focus:outline-none focus:ring-4 focus:ring-blue-300/50"
                    >
                        Explore the Docs{" "}
                        <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </a>
                </div>
            </section>

            {/* Footer */}
            <footer className="w-full border-t border-gray-200 dark:border-gray-800 py-8 text-center text-gray-400 text-base bg-white/60 dark:bg-black/20 backdrop-blur-md">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-2">
                    <div>
                        &copy; {new Date().getFullYear()} pathing.cc &mdash;
                        Built by{" "}
                        <a
                            href="https://github.com/bboonstra"
                            className="text-blue-600 dark:text-blue-400"
                        >
                            Ben Boonstra
                        </a>
                    </div>
                    <div className="hidden sm:block mx-2">|</div>
                    <a
                        href="/tos"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                        Terms of Service
                    </a>
                </div>
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
