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
                        Last updated: May 8, 2025
                    </p>
                </div>

                {/* Table of Contents */}
                <div className="mb-10 p-6 bg-white/70 dark:bg-gray-900/70 rounded-xl shadow-md backdrop-blur-sm">
                    <h2 className="text-lg font-semibold mb-3">Contents</h2>
                    <ul className="space-y-2">
                        <li>
                            <a
                                href="#definitions"
                                className="text-blue-600 dark:text-blue-400 hover:underline"
                            >
                                0. Definitions
                            </a>
                        </li>
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
                                href="#intellectual-property"
                                className="text-blue-600 dark:text-blue-400 hover:underline"
                            >
                                4. Intellectual Property Rights
                            </a>
                        </li>
                        <li>
                            <a
                                href="#governing-law"
                                className="text-blue-600 dark:text-blue-400 hover:underline"
                            >
                                5. Governing Law and Dispute Resolution
                            </a>
                        </li>
                        <li>
                            <a
                                href="#limitation-of-liability"
                                className="text-blue-600 dark:text-blue-400 hover:underline"
                            >
                                6. Limitation of Liability
                            </a>
                        </li>
                        <li>
                            <a
                                href="#updates-to-terms"
                                className="text-blue-600 dark:text-blue-400 hover:underline"
                            >
                                7. Updates to Terms
                            </a>
                        </li>
                        <li>
                            <a
                                href="#severability"
                                className="text-blue-600 dark:text-blue-400 hover:underline"
                            >
                                8. Severability
                            </a>
                        </li>
                        <li>
                            <a
                                href="#entire-agreement"
                                className="text-blue-600 dark:text-blue-400 hover:underline"
                            >
                                9. Entire Agreement
                            </a>
                        </li>
                        <li>
                            <a
                                href="#waiver"
                                className="text-blue-600 dark:text-blue-400 hover:underline"
                            >
                                10. Waiver
                            </a>
                        </li>
                        <li>
                            <a
                                href="#contact"
                                className="text-blue-600 dark:text-blue-400 hover:underline"
                            >
                                11. Contact Information
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Definitions */}
                <section id="definitions" className="mb-10">
                    <div className="bg-white/70 dark:bg-gray-900/70 rounded-xl p-6 shadow-md backdrop-blur-sm">
                        <h2 className="text-2xl font-bold mb-5">
                            0. Definitions
                        </h2>
                        <div className="space-y-4 text-gray-700 dark:text-gray-300">
                            <p>
                                <strong>&quot;Service&quot;</strong> refers to
                                the web analytics services provided by
                                pathing.cc, which allow Service Users to track
                                and analyze End User behavior on their Websites.
                            </p>
                            <p>
                                <strong>&quot;Service User&quot;</strong> (or
                                &quot;you&quot;, &quot;your&quot;) refers to any
                                individual, company, or entity that accesses or
                                uses the Service for their Website(s).
                            </p>
                            <p>
                                <strong>&quot;End User&quot;</strong> refers to
                                any individual who visits a Website that
                                utilizes the Service for web analytics.
                            </p>
                            <p>
                                <strong>&quot;Website&quot;</strong> refers to
                                the domain(s) and subdomain(s) owned or operated
                                by the Service User on which the Service is
                                implemented.
                            </p>
                            <p>
                                <strong>&quot;Terms&quot;</strong> refers to
                                these Terms of Service.
                            </p>
                        </div>
                    </div>
                </section>

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
                                    By accessing or using the{" "}
                                    <strong>Service</strong>, you (the{" "}
                                    <strong>Service User</strong>) agree to be
                                    bound by these <strong>Terms</strong>. If
                                    you do not agree to these{" "}
                                    <strong>Terms</strong>, please do not use
                                    our <strong>Service</strong>.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mb-2">
                                    1.2 Description of Service
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Pathing.cc provides the{" "}
                                    <strong>Service</strong>, web analytics
                                    services that allow{" "}
                                    <strong>Service Users</strong> to track and
                                    analyze <strong>End User</strong> behavior
                                    on their <strong>Websites</strong>. Our
                                    Service is provided &quot;as is&quot; and
                                    &quot;as available.&quot;
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mb-2">
                                    1.3 Account Responsibilities
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                    As a <strong>Service User</strong>, you are
                                    responsible for maintaining the
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
                                    <strong>Service Users</strong> agree not to
                                    use the Service to:
                                </p>
                                <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-700 dark:text-gray-300">
                                    <li>
                                        Violate any applicable laws or
                                        regulations
                                    </li>
                                    <li>Infringe upon the rights of others</li>
                                    <li>
                                        Track personally identifiable
                                        information (PII) of{" "}
                                        <strong>End Users</strong> without
                                        proper consent
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
                                    discontinue any part of our{" "}
                                    <strong>Service</strong> at any time without
                                    prior notice. We will not be liable to you
                                    (the <strong>Service User</strong>) or any
                                    third party for any such modifications.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mb-2">
                                    1.6 Termination
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                    We may terminate or suspend your (the{" "}
                                    <strong>Service User&apos;s</strong>)
                                    account at our discretion without prior
                                    notice for violation of these{" "}
                                    <strong>Terms</strong>. Upon termination,
                                    your right to use the{" "}
                                    <strong>Service</strong> will cease
                                    immediately.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mb-2">
                                    1.7 Age Requirement
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                    <strong>Service Users</strong> must be at
                                    least 16 years old to use the pathing.cc{" "}
                                    <strong>Service</strong>. By using our{" "}
                                    <strong>Service</strong>, you (the{" "}
                                    <strong>Service User</strong>) represent and
                                    warrant that you are at least 16 years of
                                    age.
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
                                    from <strong>Websites</strong> that
                                    implement our tracking script. This data
                                    includes page views, clicks,{" "}
                                    <strong>End User</strong> paths, browser
                                    information, and device information. We do
                                    not collect personally identifiable
                                    information (PII) from{" "}
                                    <strong>End Users</strong> unless explicitly
                                    permitted by <strong>Service Users</strong>{" "}
                                    through their configuration of the{" "}
                                    <strong>Service</strong> and with proper
                                    consent from the <strong>End User</strong>.
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
                                        Provide analytics services to our{" "}
                                        <strong>Service Users</strong>
                                    </li>
                                    <li>
                                        Improve our products and{" "}
                                        <strong>Service</strong>
                                    </li>
                                    <li>
                                        Monitor the performance of our{" "}
                                        <strong>Service</strong>
                                    </li>
                                    <li>Prevent fraud and abuse</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mb-2">
                                    2.3 Data Sharing
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                    We do not sell or rent{" "}
                                    <strong>End User</strong> data to third
                                    parties. We may share data with trusted
                                    service providers who assist us in operating
                                    our <strong>Service</strong>, conducting our
                                    business, or servicing{" "}
                                    <strong>Service Users</strong>, as long as
                                    they agree to keep this information
                                    confidential.
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
                                    data related to{" "}
                                    <strong>Service Users</strong> and{" "}
                                    <strong>End Users</strong>. However, no
                                    method of transmission over the Internet or
                                    electronic storage is 100% secure.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mb-2">
                                    2.5 User Rights
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                    <strong>Service Users</strong> have the
                                    right to access, correct, or delete their
                                    personal information.{" "}
                                    <strong>Service Users</strong>
                                    are responsible for informing their
                                    <strong>End Users</strong> about the use of
                                    our analytics <strong>Service</strong>
                                    and obtaining necessary consents.{" "}
                                    <strong>End Users</strong> should refer to
                                    the privacy policy of the{" "}
                                    <strong>Website</strong> they are visiting
                                    for information on their data rights.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mb-2">
                                    2.6 Cookies and Tracking Technologies
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                    We use cookies and similar tracking
                                    technologies that store anonymous
                                    identifiers to provide and improve our{" "}
                                    <strong>Service</strong>. These cookies do
                                    not directly contain personally identifiable
                                    information of <strong>End Users</strong>{" "}
                                    and are used solely for analytics and{" "}
                                    <strong>Service</strong>
                                    functionality. By using our{" "}
                                    <strong>Service</strong>,{" "}
                                    <strong>Service Users</strong>
                                    consent to our use of these technologies as
                                    described in this policy, and are
                                    responsible for obtaining appropriate
                                    consent from their{" "}
                                    <strong>End Users</strong> for such cookie
                                    usage on their <strong>Websites</strong> as
                                    required by applicable laws and regulations.
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
                                    <strong>Service Users</strong> may change
                                    their subscription at any time. Upon change,{" "}
                                    <strong>Service Users</strong> will
                                    immediately be billed for any outstanding
                                    use of their previous subscription and lose
                                    or gain access to the parts of the{" "}
                                    <strong>Service</strong>, based on the
                                    changes they make to their subscription.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mb-2">
                                    3.2 Refund Eligibility
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                    We offer refunds to{" "}
                                    <strong>Service Users</strong> within 14
                                    days of switching to a usage-based plan for
                                    the first time if they are not satisfied
                                    with our <strong>Service</strong>. This
                                    refund will be in the form of a cancellation
                                    of all billing for the refunded cycle.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mb-2">
                                    3.3 Refund Process
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                    To request a refund,{" "}
                                    <strong>Service Users</strong> should
                                    contact us at refunds@pathing.cc with their
                                    account information and reason for the
                                    refund request. Refunds, which will take the
                                    form of a cancellation of all billing for
                                    the previous cycle, will typically be
                                    processed within 7 business days of
                                    approval. The cancellation will be applied
                                    before your next billing date if the request
                                    is approved and processed prior to it.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mb-2">
                                    3.4 Exceptions
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                    We reserve the right to deny refund requests
                                    from <strong>Service Users</strong> in cases
                                    of:
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

                {/* Intellectual Property Rights */}
                <section id="intellectual-property" className="mb-10">
                    <div className="bg-white/70 dark:bg-gray-900/70 rounded-xl p-6 shadow-md backdrop-blur-sm">
                        <h2 className="text-2xl font-bold mb-5">
                            4. Intellectual Property Rights
                        </h2>
                        <div className="space-y-6 text-gray-700 dark:text-gray-300">
                            <p>
                                All rights, title, and interest in and to the{" "}
                                <strong>Service</strong>, including but not
                                limited to all software, technology, code, user
                                interfaces, designs, trademarks, logos, and
                                other intellectual property rights, are and will
                                remain the exclusive property of pathing.cc and
                                its licensors. These <strong>Terms</strong> do
                                not grant you (the <strong>Service User</strong>
                                ) any rights to use pathing.cc&apos;s
                                trademarks, logos, domain names, or other
                                distinctive brand features without our prior
                                written consent.
                            </p>
                            <p>
                                Notwithstanding the above,{" "}
                                <strong>Service Users</strong> are permitted to
                                use pathing.cc&apos;s logo and branding solely
                                for the purpose of advertising our{" "}
                                <strong>Service</strong> or notifying their{" "}
                                <strong>End Users</strong> about the use of our
                                analytics tools. This includes, but is not
                                limited to, displaying our logo in privacy
                                policies, cookie notices, or other disclosures
                                related to analytics tracking on their{" "}
                                <strong>Websites</strong>. Such use must be in
                                accordance with our brand guidelines and must
                                not imply any endorsement, sponsorship, or
                                affiliation beyond the use of our{" "}
                                <strong>Service</strong>.
                            </p>
                            <p>
                                You, the <strong>Service User</strong>, retain
                                full ownership of the data collected from your{" "}
                                <strong>Website(s)</strong> through the use of
                                the <strong>Service</strong> (&quot;
                                <strong>User Data</strong>&quot;). You grant
                                pathing.cc a worldwide, non-exclusive,
                                royalty-free license to use, reproduce, modify,
                                display, and distribute{" "}
                                <strong>User Data</strong> solely for the
                                purpose of providing, maintaining, and improving
                                the <strong>Service</strong>, and as otherwise
                                permitted by our Privacy Policy. This license
                                terminates when your account is closed, except
                                to the extent necessary for us to comply with
                                legal obligations or for backup and archival
                                purposes.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Governing Law and Dispute Resolution */}
                <section id="governing-law" className="mb-10">
                    <div className="bg-white/70 dark:bg-gray-900/70 rounded-xl p-6 shadow-md backdrop-blur-sm">
                        <h2 className="text-2xl font-bold mb-5">
                            5. Governing Law and Dispute Resolution
                        </h2>
                        <div className="space-y-6 text-gray-700 dark:text-gray-300">
                            <p>
                                These <strong>Terms</strong> and any action
                                related thereto will be governed by the laws of
                                the State of Delaware, United States, without
                                regard to its conflict of laws provisions.
                            </p>
                            <p>
                                Any dispute, claim, or controversy arising out
                                of or relating to these <strong>Terms</strong>{" "}
                                or the breach, termination, enforcement,
                                interpretation, or validity thereof, or the use
                                of the <strong>Service</strong> (collectively,
                                &quot;Disputes&quot;) will be resolved by
                                binding arbitration, except that each party
                                retains the right: (i) to bring an individual
                                action in small claims court and (ii) to seek
                                injunctive or other equitable relief in a court
                                of competent jurisdiction to prevent the actual
                                or threatened infringement, misappropriation, or
                                violation of a party&apos;s copyrights,
                                trademarks, trade secrets, patents, or other
                                intellectual property rights.
                            </p>
                            <p>
                                <strong>
                                    You agree that you and pathing.cc are each
                                    waiving the right to a trial by jury or to
                                    participate in a class action.
                                </strong>{" "}
                                This arbitration provision shall survive
                                termination of these <strong>Terms</strong>.
                            </p>
                            <p>
                                The arbitration will be administered by the
                                American Arbitration Association
                                (&quot;AAA&quot;) in accordance with the
                                Commercial Arbitration Rules and the
                                Supplementary Procedures for Consumer Related
                                Disputes (the &quot;AAA Rules&quot;) then in
                                effect, except as modified by this &quot;Dispute
                                Resolution&quot; section. The Federal
                                Arbitration Act will govern the interpretation
                                and enforcement of this section.
                            </p>
                            <p>
                                A party who desires to initiate arbitration must
                                provide the other party with a written Demand
                                for Arbitration as specified in the AAA Rules.
                                The arbitrator will be either a retired judge or
                                an attorney licensed to practice law and will be
                                selected by the parties from the AAA&apos;s
                                roster of arbitrators. If the parties are unable
                                to agree upon an arbitrator within seven (7)
                                days of delivery of the Demand for Arbitration,
                                then the AAA will appoint the arbitrator in
                                accordance with the AAA Rules.
                            </p>
                            <p>
                                Unless you and pathing.cc otherwise agree, the
                                arbitration will be conducted in the county
                                where you reside. If your claim does not exceed
                                $10,000, then the arbitration will be conducted
                                solely on the basis of documents you and
                                pathing.cc submit to the arbitrator, unless you
                                request a hearing or the arbitrator determines
                                that a hearing is necessary. If your claim
                                exceeds $10,000, your right to a hearing will be
                                determined by the AAA Rules.
                            </p>
                            <p>
                                The arbitrator will render an award within the
                                time frame specified in the AAA Rules. The
                                arbitrator&apos;s decision will include the
                                essential findings and conclusions upon which
                                the arbitrator based the award. Judgment on the
                                arbitration award may be entered in any court
                                having jurisdiction thereof. The
                                arbitrator&apos;s award of damages must be
                                consistent with the terms of the
                                &quot;Limitation of Liability&quot; section
                                below as to the types and amounts of damages for
                                which a party may be liable.
                            </p>
                            <p>
                                For any inquiries or attempts at informal
                                resolution before arbitration, please contact us
                                at{" "}
                                <a
                                    href="mailto:tos@pathing.cc"
                                    className="text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                    tos@pathing.cc
                                </a>
                                .
                            </p>
                        </div>
                    </div>
                </section>

                {/* Limitation of Liability */}
                <section id="limitation-of-liability" className="mb-16">
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl p-6">
                        <h2 className="text-2xl font-bold mb-2">
                            6. Limitation of Liability
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                            To the fullest extent permitted by applicable law,
                            pathing.cc and its affiliates, officers, employees,
                            agents, partners, and licensors shall not be liable
                            for any indirect, incidental, special,
                            consequential, or punitive damages, or any loss of
                            profits or revenues, whether incurred directly or
                            indirectly, or any loss of data, use, goodwill, or
                            other intangible losses, resulting from (a) a{" "}
                            <strong>Service User&apos;s</strong> or{" "}
                            <strong>End User&apos;s</strong> use or inability to
                            use the <strong>Service</strong>; (b) any
                            unauthorized access to or use of our servers and/or
                            any personal information or data stored therein; (c)
                            any interruption or cessation of transmission to or
                            from the <strong>Service</strong>; (d) any bugs,
                            viruses, trojan horses, or the like that may be
                            transmitted to or through our{" "}
                            <strong>Service</strong> by any third party; or (e)
                            any errors or omissions in any content or for any
                            loss or damage incurred as a result of the use of
                            any content posted, emailed, transmitted, or
                            otherwise made available through the{" "}
                            <strong>Service</strong>. In no event shall
                            pathing.cc&apos;s aggregate liability for all claims
                            relating to the <strong>Service</strong> exceed the
                            amount paid by the <strong>Service User</strong> to
                            pathing.cc in the 12 months preceding the claim.
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                            <strong>Service Users</strong> agree to indemnify
                            and hold harmless pathing.cc and its affiliates from
                            and against any claims, liabilities, damages,
                            losses, and expenses, including reasonable legal and
                            accounting fees, arising out of or in any way
                            connected with their access to or use of the{" "}
                            <strong>Service</strong>, their{" "}
                            <strong>Websites</strong>, or their violation of
                            these <strong>Terms</strong>.
                        </p>
                    </div>
                </section>

                {/* Updates to Terms */}
                <section id="updates-to-terms" className="mb-16">
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl p-6 text-center">
                        <h2 className="text-2xl font-bold mb-2">
                            7. Updates to Terms
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300">
                            We may update these <strong>Terms</strong> from time
                            to time. We will notify{" "}
                            <strong>Service Users</strong> of any significant
                            changes by posting a notice on our website or
                            sending an email to the address associated with
                            their account. Continued use of the{" "}
                            <strong>Service</strong> after such changes
                            constitutes acceptance of the new{" "}
                            <strong>Terms</strong>.
                        </p>
                    </div>
                </section>

                {/* Severability */}
                <section id="severability" className="mb-10">
                    <div className="bg-white/70 dark:bg-gray-900/70 rounded-xl p-6 shadow-md backdrop-blur-sm">
                        <h2 className="text-2xl font-bold mb-5">
                            8. Severability
                        </h2>
                        <div className="space-y-6 text-gray-700 dark:text-gray-300">
                            <p>
                                If any provision of these <strong>Terms</strong>{" "}
                                is held to be invalid, illegal, or unenforceable
                                by a court of competent jurisdiction, such
                                provision shall be modified to the minimum
                                extent necessary to make it valid, legal, and
                                enforceable, or if modification is not possible,
                                it shall be severed from these{" "}
                                <strong>Terms</strong>. The remaining provisions
                                of these <strong>Terms</strong> will continue in
                                full force and effect.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Entire Agreement */}
                <section id="entire-agreement" className="mb-10">
                    <div className="bg-white/70 dark:bg-gray-900/70 rounded-xl p-6 shadow-md backdrop-blur-sm">
                        <h2 className="text-2xl font-bold mb-5">
                            9. Entire Agreement
                        </h2>
                        <div className="space-y-6 text-gray-700 dark:text-gray-300">
                            <p>
                                These <strong>Terms</strong>, together with our
                                Privacy Policy and any other legal notices
                                published by pathing.cc on the{" "}
                                <strong>Service</strong>, shall constitute the
                                entire agreement between you (the{" "}
                                <strong>Service User</strong>) and pathing.cc
                                concerning the <strong>Service</strong>. These{" "}
                                <strong>Terms</strong> supersede all prior or
                                contemporaneous communications and proposals,
                                whether electronic, oral, or written, between
                                you and pathing.cc with respect to the{" "}
                                <strong>Service</strong>.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Waiver */}
                <section id="waiver" className="mb-10">
                    <div className="bg-white/70 dark:bg-gray-900/70 rounded-xl p-6 shadow-md backdrop-blur-sm">
                        <h2 className="text-2xl font-bold mb-5">10. Waiver</h2>
                        <div className="space-y-6 text-gray-700 dark:text-gray-300">
                            <p>
                                The failure of pathing.cc to enforce any right
                                or provision of these <strong>Terms</strong>{" "}
                                will not be deemed a waiver of such right or
                                provision. Any waiver of any provision of these{" "}
                                <strong>Terms</strong> will be effective only if
                                in writing and signed by an authorized
                                representative of pathing.cc. The waiver of any
                                such right or provision will not be considered a
                                waiver of any subsequent breach or default.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Contact Information */}
                <section id="contact" className="mb-10">
                    <div className="bg-white/70 dark:bg-gray-900/70 rounded-xl p-6 shadow-md backdrop-blur-sm">
                        <h2 className="text-2xl font-bold mb-5">
                            11. Contact Information
                        </h2>

                        <div className="space-y-6">
                            <p className="text-gray-700 dark:text-gray-300">
                                If you have any questions about these{" "}
                                <strong>Terms</strong>, please contact us at:
                            </p>

                            <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-lg border border-blue-100 dark:border-blue-800">
                                <p className="font-medium">
                                    Email:{" "}
                                    <a
                                        href="mailto:tos@pathing.cc"
                                        className="text-blue-600 dark:text-blue-400"
                                    >
                                        tos@pathing.cc
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
