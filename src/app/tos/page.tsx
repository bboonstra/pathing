"use client";

import { useEffect } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { pathing } from "pathingjs";

export default function TermsOfService() {
    // Initialize pathing
    useEffect(() => {
        const apiKey = process.env.NEXT_PUBLIC_PATHING_API_KEY;
        if (apiKey) {
            pathing.init(apiKey);
        }
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-100 dark:from-[#0a0a0a] dark:via-[#181824] dark:to-[#1a1a2e] text-[var(--foreground)] font-sans transition-colors duration-500">
            {/* Navbar */}
            <Navbar />

            <main className="flex-1 max-w-4xl mx-auto px-4 py-32">
                {/* Header */}
                <div className="mb-12 text-center">
                    <div className="flex items-center justify-center mb-4">
                        <Image
                            src="/pathing.png"
                            alt="Pathing Logo"
                            width={48}
                            height={48}
                            className="m-0 p-0"
                        />
                        <h1 className="text-4xl font-bold ml-2">
                            Terms of Service
                        </h1>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                        Last updated:{" "}
                        {new Date().toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                        })}
                    </p>
                </div>

                {/* Table of Contents */}
                <div className="mb-10 p-6 bg-white/70 dark:bg-gray-900/70 rounded-xl shadow-md backdrop-blur-sm">
                    <h2 className="text-lg font-semibold mb-3">Contents</h2>
                    <ul className="space-y-2">
                        <li>
                            <a
                                href="#terms"
                                className="text-blue-600 dark:text-blue-400 hover:underline"
                            >
                                1. Terms of Service
                            </a>
                        </li>
                        <li>
                            <a
                                href="#privacy"
                                className="text-blue-600 dark:text-blue-400 hover:underline"
                            >
                                2. Privacy Policy
                            </a>
                        </li>
                        <li>
                            <a
                                href="#refunds"
                                className="text-blue-600 dark:text-blue-400 hover:underline"
                            >
                                3. Refund Policy
                            </a>
                        </li>
                        <li>
                            <a
                                href="#contact"
                                className="text-blue-600 dark:text-blue-400 hover:underline"
                            >
                                4. Contact Information
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Terms of Service */}
                <section id="terms" className="mb-10">
                    <div className="bg-white/70 dark:bg-gray-900/70 rounded-xl p-6 shadow-md backdrop-blur-sm">
                        <h2 className="text-2xl font-bold mb-5">
                            1. Terms of Service
                        </h2>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xl font-semibold mb-2">
                                    1.1 Acceptance of Terms
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                    By accessing or using the pathing.cc
                                    service, you agree to be bound by these
                                    Terms of Service. If you do not agree to
                                    these terms, please do not use our service.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mb-2">
                                    1.2 Description of Service
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Pathing.cc provides web analytics services
                                    that allow website owners to track and
                                    analyze user behavior on their websites. Our
                                    service is provided "as is" and "as
                                    available."
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mb-2">
                                    1.3 Account Responsibilities
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                    You are responsible for maintaining the
                                    confidentiality of your account information
                                    and for all activities that occur under your
                                    account. You agree to notify us immediately
                                    of any unauthorized use of your account.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mb-2">
                                    1.4 Usage Limitations
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                    You agree not to use the service to:
                                </p>
                                <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-700 dark:text-gray-300">
                                    <li>
                                        Violate any applicable laws or
                                        regulations
                                    </li>
                                    <li>Infringe upon the rights of others</li>
                                    <li>
                                        Track personally identifiable
                                        information without proper consent
                                    </li>
                                    <li>
                                        Distribute malware or other harmful code
                                    </li>
                                    <li>
                                        Attempt to gain unauthorized access to
                                        our systems
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mb-2">
                                    1.5 Service Modifications
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                    We reserve the right to modify, suspend, or
                                    discontinue any part of our service at any
                                    time without prior notice. We will not be
                                    liable to you or any third party for any
                                    such modifications.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mb-2">
                                    1.6 Termination
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                    We may terminate or suspend your account at
                                    our discretion without prior notice for
                                    violation of these Terms. Upon termination,
                                    your right to use the service will cease
                                    immediately.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mb-2">
                                    1.7 Age Requirement
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                    You must be at least 14 years old to use the
                                    pathing.cc service. By using our service,
                                    you represent and warrant that you are at
                                    least 14 years of age.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Privacy Policy */}
                <section id="privacy" className="mb-10">
                    <div className="bg-white/70 dark:bg-gray-900/70 rounded-xl p-6 shadow-md backdrop-blur-sm">
                        <h2 className="text-2xl font-bold mb-5">
                            2. Privacy Policy
                        </h2>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xl font-semibold mb-2">
                                    2.1 Data Collection
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Pathing.cc collects anonymous usage data
                                    from websites that implement our tracking
                                    script. This data includes page views,
                                    clicks, user paths, browser information, and
                                    device information. We do not collect
                                    personally identifiable information unless
                                    explicitly provided by users.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mb-2">
                                    2.2 Data Usage
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                    We use collected data to:
                                </p>
                                <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-700 dark:text-gray-300">
                                    <li>
                                        Provide analytics services to our users
                                    </li>
                                    <li>Improve our products and services</li>
                                    <li>
                                        Monitor the performance of our service
                                    </li>
                                    <li>Prevent fraud and abuse</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mb-2">
                                    2.3 Data Sharing
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                    We do not sell or rent your data to third
                                    parties. We may share data with trusted
                                    service providers who assist us in operating
                                    our service, conducting our business, or
                                    servicing you, as long as they agree to keep
                                    this information confidential.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mb-2">
                                    2.4 Data Security
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                    We implement appropriate security measures
                                    to protect against unauthorized access,
                                    alteration, disclosure, or destruction of
                                    your data. However, no method of
                                    transmission over the Internet or electronic
                                    storage is 100% secure.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mb-2">
                                    2.5 User Rights
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Users have the right to access, correct, or
                                    delete their personal information. Website
                                    owners are responsible for informing their
                                    users about the use of our analytics service
                                    and obtaining necessary consents.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mb-2">
                                    2.6 Cookies and Tracking Technologies
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                    We use anonymized cookies and similar
                                    tracking technologies to provide and improve
                                    our services. These cookies do not contain
                                    personally identifiable information and are
                                    used solely for analytics and service
                                    functionality. By using our service, you
                                    consent to our use of cookies as described
                                    in this policy.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Refund Policy */}
                <section id="refunds" className="mb-10">
                    <div className="bg-white/70 dark:bg-gray-900/70 rounded-xl p-6 shadow-md backdrop-blur-sm">
                        <h2 className="text-2xl font-bold mb-5">
                            3. Refund Policy
                        </h2>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xl font-semibold mb-2">
                                    3.1 Subscription Cancellations
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                    You may cancel your subscription at any
                                    time. Upon cancellation, you will continue
                                    to have access to the service until the end
                                    of your current billing period, after which
                                    your access will be reverted to the free
                                    tier.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mb-2">
                                    3.2 Refund Eligibility
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                    We offer refunds within 14 days of the
                                    initial purchase if you are not satisfied
                                    with our service. For usage-based plans,
                                    refunds will be prorated based on the amount
                                    of service used.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mb-2">
                                    3.3 Refund Process
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                    To request a refund, please contact us at
                                    tos@bboonstra.dev with your account
                                    information and reason for the refund
                                    request. Refunds will be processed within
                                    7-10 business days and will be issued using
                                    the original payment method.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mb-2">
                                    3.4 Exceptions
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                    We reserve the right to deny refund requests
                                    in cases of:
                                </p>
                                <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-700 dark:text-gray-300">
                                    <li>Abuse of the refund policy</li>
                                    <li>Violation of our Terms of Service</li>
                                    <li>
                                        Requests made after the 14-day period
                                    </li>
                                    <li>Custom enterprise solutions</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Contact Information */}
                <section id="contact" className="mb-10">
                    <div className="bg-white/70 dark:bg-gray-900/70 rounded-xl p-6 shadow-md backdrop-blur-sm">
                        <h2 className="text-2xl font-bold mb-5">
                            4. Contact Information
                        </h2>

                        <div className="space-y-6">
                            <p className="text-gray-700 dark:text-gray-300">
                                If you have any questions about these Terms of
                                Service, please contact us at:
                            </p>

                            <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-lg border border-blue-100 dark:border-blue-800">
                                <p className="font-medium">
                                    Email:{" "}
                                    <a
                                        href="mailto:tos@bboonstra.dev"
                                        className="text-blue-600 dark:text-blue-400"
                                    >
                                        tos@bboonstra.dev
                                    </a>
                                </p>
                            </div>

                            <p className="text-gray-700 dark:text-gray-300">
                                We aim to respond to all inquiries within 2
                                business days.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Updates */}
                <section className="mb-16">
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl p-6 text-center">
                        <h2 className="text-xl font-bold mb-2">
                            Updates to Terms
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300">
                            We may update these terms from time to time. We will
                            notify users of any significant changes by posting a
                            notice on our website or sending an email to the
                            address associated with your account.
                        </p>
                    </div>
                </section>

                {/* Limitation of Liability */}
                <section className="mb-16">
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl p-6">
                        <h2 className="text-xl font-bold mb-2">
                            Limitation of Liability
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                            To the fullest extent permitted by applicable law,
                            pathing.cc and its affiliates, officers, employees,
                            agents, partners, and licensors shall not be liable
                            for any indirect, incidental, special,
                            consequential, or punitive damages, or any loss of
                            profits or revenues, whether incurred directly or
                            indirectly, or any loss of data, use, goodwill, or
                            other intangible losses, resulting from (a) your use
                            or inability to use the service; (b) any
                            unauthorized access to or use of our servers and/or
                            any personal information stored therein; (c) any
                            interruption or cessation of transmission to or from
                            the service; (d) any bugs, viruses, trojan horses,
                            or the like that may be transmitted to or through
                            our service by any third party; or (e) any errors or
                            omissions in any content or for any loss or damage
                            incurred as a result of the use of any content
                            posted, emailed, transmitted, or otherwise made
                            available through the service.
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                            You agree to indemnify and hold harmless pathing.cc
                            and its affiliates from and against any claims,
                            liabilities, damages, losses, and expenses,
                            including reasonable legal and accounting fees,
                            arising out of or in any way connected with your
                            access to or use of the service, or your violation
                            of these Terms.
                        </p>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="w-full border-t border-gray-200 dark:border-gray-800 py-8 text-center text-gray-400 text-base bg-white/60 dark:bg-black/20 backdrop-blur-md">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
                    <div>
                        &copy; {new Date().getFullYear()} pathing.cc &mdash;
                        Built by{" "}
                        <a
                            href="https://github.com/bboonstra"
                            className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                            Ben Boonstra
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
