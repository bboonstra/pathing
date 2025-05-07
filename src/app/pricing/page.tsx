"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { pathing } from "pathingjs";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function Pricing() {
    const router = useRouter();
    const [eventVolume, setEventVolume] = useState(10000);
    const [domainCount, setDomainCount] = useState(1);
    const [estimatedCost, setEstimatedCost] = useState(0);

    // Initialize pathing
    useEffect(() => {
        const apiKey = process.env.NEXT_PUBLIC_PATHING_API_KEY;
        if (apiKey) {
            pathing.init(apiKey);
        }
    }, []);

    // Calculate estimated cost based on event volume and domain count
    useEffect(() => {
        const baseRate = 0.0001; // $0.0001 per event
        const freeEvents = 1000;
        const billableEvents = Math.max(0, eventVolume - freeEvents);
        const cost = billableEvents * baseRate * domainCount;
        setEstimatedCost(cost);
    }, [eventVolume, domainCount]);

    // Convert linear value to exponential scale
    const linearToExponential = (value: number) => {
        const min = 10;
        const max = 1000000;
        const scale = Math.log(max / min);
        return Math.round(min * Math.exp((value / 100) * scale));
    };

    // Convert exponential value to linear scale
    const exponentialToLinear = (value: number) => {
        const min = 10;
        const max = 1000000;
        const scale = Math.log(max / min);
        return (Math.log(value / min) / scale) * 100;
    };

    // Track pricing page interactions
    useEffect(() => {
        const calculatorRef = document.getElementById("usage-calculator");
        if (calculatorRef) {
            pathing.link.button(calculatorRef, {
                location: "pricing-page",
                action: "calculator_interaction",
                buttonId: "usage-calculator",
            });
        }

        // Track pricing tier buttons
        const freeTierButton = document.querySelector(
            '[data-tier="free"]'
        ) as HTMLButtonElement;
        const usageBasedButton = document.querySelector(
            '[data-tier="usage-based"]'
        ) as HTMLButtonElement;
        const enterpriseButton = document.querySelector(
            '[data-tier="enterprise"]'
        ) as HTMLButtonElement;

        if (freeTierButton) {
            pathing.link.button(freeTierButton, {
                location: "pricing-page",
                action: "tier_selection",
                buttonId: "free-tier",
            });
        }

        if (usageBasedButton) {
            pathing.link.button(usageBasedButton, {
                location: "pricing-page",
                action: "tier_selection",
                buttonId: "usage-based-tier",
            });
        }

        if (enterpriseButton) {
            pathing.link.button(enterpriseButton, {
                location: "pricing-page",
                action: "tier_selection",
                buttonId: "enterprise-tier",
            });
        }
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-100 dark:from-[#0a0a0a] dark:via-[#181824] dark:to-[#1a1a2e] text-[var(--foreground)] font-sans transition-colors duration-500">
            {/* Navbar */}
            <Navbar />

            {/* Hero Section */}
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
                        Simple, Transparent Pricing
                    </h1>
                </div>
                <h2 className="relative z-10 text-2xl sm:text-3xl font-semibold mb-6 text-gray-700 dark:text-gray-200">
                    Pay only for what you use. Start free, scale as you grow.
                </h2>
                <p className="relative z-10 max-w-2xl mx-auto mb-10 text-lg sm:text-xl text-gray-500 dark:text-gray-400 font-medium">
                    No hidden fees, no surprises. Our usage-based pricing
                    ensures you only pay for the analytics you need.
                </p>
            </header>

            {/* Pricing Tiers */}
            <section className="max-w-7xl mx-auto px-4 mb-20">
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Free Tier */}
                    <div className="backdrop-blur-lg bg-white/60 dark:bg-white/10 rounded-2xl p-8 shadow-xl border border-white/40 dark:border-white/10">
                        <div className="text-center mb-8">
                            <h3 className="text-2xl font-bold mb-2">Free</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Perfect for small projects
                            </p>
                        </div>
                        <ul className="space-y-4 mb-8">
                            <li className="flex items-center">
                                <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                                <span>Full API access</span>
                            </li>
                            <li className="flex items-center">
                                <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                                <span>Complex analytics dashboard</span>
                            </li>
                            <li className="flex items-center">
                                <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                                <span>1,000 events</span>
                            </li>
                            <li className="flex items-center">
                                <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                                <span>Basic analytics</span>
                            </li>
                        </ul>
                        <button
                            data-tier="free"
                            onClick={() => router.push("/dashboard")}
                            className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-blue-400 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-6 py-3 rounded-full shadow-xl transition-all text-lg flex items-center justify-center gap-2 focus:outline-none focus:ring-4 focus:ring-blue-300"
                        >
                            Start Free
                        </button>
                    </div>

                    {/* Usage-Based Tier */}
                    <div className="backdrop-blur-lg bg-white/60 dark:bg-white/10 rounded-2xl p-8 shadow-xl border border-white/40 dark:border-white/10 relative">
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                            <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                                Most Popular
                            </span>
                        </div>
                        <div className="text-center mb-8">
                            <h3 className="text-2xl font-bold mb-2">
                                Usage-Based
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Pay per event
                            </p>
                        </div>
                        <ul className="space-y-4 mb-8">
                            <li className="flex items-center">
                                <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                                <span>All Free tier features</span>
                            </li>
                            <li className="flex items-center">
                                <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                                <span>Unlimited event storage</span>
                            </li>
                            <li className="flex items-center">
                                <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                                <span>Advanced analytics</span>
                            </li>
                            <li className="flex items-center">
                                <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                                <span>Usage calculator</span>
                            </li>
                        </ul>
                        <button
                            data-tier="usage-based"
                            onClick={() => router.push("/dashboard/pricing")}
                            className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-blue-400 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-6 py-3 rounded-full shadow-xl transition-all text-lg flex items-center justify-center gap-2 focus:outline-none focus:ring-4 focus:ring-blue-300"
                        >
                            Get Started
                        </button>
                    </div>

                    {/* Usage-Based Plus Tier */}
                    <div className="backdrop-blur-lg bg-white/60 dark:bg-white/10 rounded-2xl p-8 shadow-xl border border-white/40 dark:border-white/10">
                        <div className="text-center mb-8">
                            <h3 className="text-2xl font-bold mb-2">
                                Usage-Based Plus
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Enterprise features
                            </p>
                        </div>
                        <ul className="space-y-4 mb-8">
                            <li className="flex items-center">
                                <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                                <span>All Usage-Based features</span>
                            </li>
                            <li className="flex items-center">
                                <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                                <span>Priority support</span>
                            </li>
                            <li className="flex items-center">
                                <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                                <span>Custom integrations</span>
                            </li>
                            <li className="flex items-center">
                                <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                                <span>Dedicated account manager</span>
                            </li>
                        </ul>
                        <button
                            data-tier="enterprise"
                            onClick={() =>
                                (window.location.href =
                                    "mailto:sales@bboonstra.dev")
                            }
                            className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-blue-400 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-6 py-3 rounded-full shadow-xl transition-all text-lg flex items-center justify-center gap-2 focus:outline-none focus:ring-4 focus:ring-blue-300"
                        >
                            Contact Sales
                        </button>
                    </div>
                </div>
            </section>

            {/* Usage Calculator */}
            <section className="max-w-4xl mx-auto px-4 mb-20">
                <div className="backdrop-blur-lg bg-white/60 dark:bg-white/10 rounded-2xl p-8 shadow-xl border border-white/40 dark:border-white/10">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold mb-4">
                            Usage Calculator
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Estimate your monthly cost based on your expected
                            usage
                        </p>
                    </div>
                    <div id="usage-calculator" className="space-y-6">
                        <div className="flex flex-wrap gap-4 justify-center mb-6">
                            <button
                                onClick={() => setEventVolume(500)}
                                className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                            >
                                Personal Portfolio (500 events)
                            </button>
                            <button
                                onClick={() => setEventVolume(10000)}
                                className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                            >
                                Startup (10,000 events)
                            </button>
                            <button
                                onClick={() => setEventVolume(100000)}
                                className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                            >
                                Company (100,000 events)
                            </button>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Monthly Event Volume
                            </label>
                            <div className="relative">
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    step="1"
                                    value={exponentialToLinear(eventVolume)}
                                    onChange={(e) =>
                                        setEventVolume(
                                            linearToExponential(
                                                Number(e.target.value)
                                            )
                                        )
                                    }
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer relative z-10"
                                />
                                <div className="absolute top-0 left-0 w-full h-2 pointer-events-none">
                                    {[
                                        10, 100, 1000, 10000, 100000, 1000000,
                                    ].map((value) => (
                                        <div
                                            key={value}
                                            className="absolute w-px h-2 bg-gray-400"
                                            style={{
                                                left: `${exponentialToLinear(
                                                    value
                                                )}%`,
                                            }}
                                        >
                                            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs text-gray-500">
                                                {value.toLocaleString()}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-10">
                                <span>10 events</span>
                                <span>
                                    {eventVolume.toLocaleString()} events
                                </span>
                                <span>1M events</span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Number of Domains
                            </label>
                            <select
                                value={domainCount}
                                onChange={(e) =>
                                    setDomainCount(Number(e.target.value))
                                }
                                className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {[1, 2, 3, 4, 5].map((num) => (
                                    <option key={num} value={num}>
                                        {num} {num === 1 ? "Domain" : "Domains"}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="text-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                            <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                                Estimated Monthly Cost
                            </h3>
                            <p className="text-4xl font-bold">
                                {estimatedCost === 0
                                    ? "FREE!"
                                    : `$${estimatedCost.toFixed(2)}`}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                Based on {eventVolume.toLocaleString()} events
                                across {domainCount}{" "}
                                {domainCount === 1 ? "domain" : "domains"}
                                {eventVolume > 1000 && (
                                    <span className="block mt-1">
                                        (First 1,000 events are free)
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature Comparison */}
            <section className="max-w-7xl mx-auto px-4 mb-20">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">
                        Feature Comparison
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Compare features across all tiers
                    </p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full backdrop-blur-lg bg-white/60 dark:bg-white/10 rounded-2xl shadow-xl border border-white/40 dark:border-white/10">
                        <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-700">
                                <th className="px-6 py-4 text-left">Feature</th>
                                <th className="px-6 py-4 text-center">Free</th>
                                <th className="px-6 py-4 text-center">
                                    Usage-Based
                                </th>
                                <th className="px-6 py-4 text-center">
                                    Usage-Based Plus
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-gray-200 dark:border-gray-700">
                                <td className="px-6 py-4">Event Storage</td>
                                <td className="px-6 py-4 text-center">
                                    1,000 events
                                </td>
                                <td className="px-6 py-4 text-center">
                                    Unlimited
                                </td>
                                <td className="px-6 py-4 text-center">
                                    Unlimited
                                </td>
                            </tr>
                            <tr className="border-b border-gray-200 dark:border-gray-700">
                                <td className="px-6 py-4">API Access</td>
                                <td className="px-6 py-4 text-center">Full</td>
                                <td className="px-6 py-4 text-center">Full</td>
                                <td className="px-6 py-4 text-center">Full</td>
                            </tr>
                            <tr className="border-b border-gray-200 dark:border-gray-700">
                                <td className="px-6 py-4">Dashboard Access</td>
                                <td className="px-6 py-4 text-center">
                                    Complex
                                </td>
                                <td className="px-6 py-4 text-center">
                                    Advanced
                                </td>
                                <td className="px-6 py-4 text-center">
                                    Enterprise
                                </td>
                            </tr>
                            <tr className="border-b border-gray-200 dark:border-gray-700">
                                <td className="px-6 py-4">Support</td>
                                <td className="px-6 py-4 text-center">
                                    Community
                                </td>
                                <td className="px-6 py-4 text-center">Email</td>
                                <td className="px-6 py-4 text-center">
                                    Priority
                                </td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4">
                                    Custom Integrations
                                </td>
                                <td className="px-6 py-4 text-center">-</td>
                                <td className="px-6 py-4 text-center">-</td>
                                <td className="px-6 py-4 text-center">✓</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="max-w-4xl mx-auto px-4 mb-20">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Common questions about our pricing and plans
                    </p>
                </div>
                <div className="space-y-6">
                    <div className="backdrop-blur-lg bg-white/60 dark:bg-white/10 rounded-2xl p-6 shadow-xl border border-white/40 dark:border-white/10">
                        <h3 className="text-xl font-semibold mb-2">
                            How is usage calculated?
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Usage is calculated based on the number of events
                            tracked across your domains. Each page view, click,
                            or custom event counts as one event.
                        </p>
                    </div>
                    <div className="backdrop-blur-lg bg-white/60 dark:bg-white/10 rounded-2xl p-6 shadow-xl border border-white/40 dark:border-white/10">
                        <h3 className="text-xl font-semibold mb-2">
                            Can I upgrade or downgrade at any time?
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Yes, you can change your plan at any time. Your
                            billing will be adjusted accordingly based on your
                            actual usage.
                        </p>
                    </div>
                    <div className="backdrop-blur-lg bg-white/60 dark:bg-white/10 rounded-2xl p-6 shadow-xl border border-white/40 dark:border-white/10">
                        <h3 className="text-xl font-semibold mb-2">
                            What happens if I exceed my free tier limits?
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            If you exceed the free tier limits, you&apos;ll be
                            automatically upgraded to the Usage-Based plan.
                            You&apos;ll only be charged for the additional
                            events beyond the free tier limit.
                        </p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="w-full border-t border-gray-200 dark:border-gray-800 py-8 text-center text-gray-400 text-base bg-white/60 dark:bg-black/20 backdrop-blur-md">
                &copy; {new Date().getFullYear()} pathing.cc &mdash; Easy
                analytics for humans.
            </footer>
        </div>
    );
}
