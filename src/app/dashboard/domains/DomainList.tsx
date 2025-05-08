"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
    TrashIcon,
    ShieldCheckIcon,
    ShieldExclamationIcon,
    InformationCircleIcon,
    ExclamationTriangleIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    CodeBracketIcon,
    DocumentTextIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import CopyButton from "@/components/CopyButton";

type Domain = {
    id: string;
    name: string;
    public_key: string;
    user_id: string;
    created_at: string;
    verified: boolean;
    verified_at: string | null;
    verification_token: string;
};

type InstallOption = {
    name: string;
    icon: string;
    code: (publicKey: string) => string;
};

export default function DomainList() {
    const [domains, setDomains] = useState<Domain[]>([]);
    const [loading, setLoading] = useState(true);
    const [verifyingDomain, setVerifyingDomain] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [domainToDelete, setDomainToDelete] = useState<Domain | null>(null);
    const [deleteConfirmation, setDeleteConfirmation] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [visibleConfig, setVisibleConfig] = useState<Record<string, boolean>>(
        {}
    );
    const [activeInstallTab, setActiveInstallTab] = useState<
        Record<string, string>
    >({});

    const installOptions: InstallOption[] = [
        {
            name: "HTML Script Tag",
            icon: "html",
            code: (publicKey: string) =>
                `<script src="${window.location.origin}/pathing.js" pathing-api-key="${publicKey}"></script>`,
        },
        {
            name: "React",
            icon: "react",
            code: (publicKey: string) =>
                `// Install the package\nnpm install pathingjs\n\n` +
                `// In your app entry point (e.g. _app.js, App.jsx)\nimport { pathing } from 'pathingjs';\n\n` +
                `function MyApp({ Component, pageProps }) {\n  useEffect(() => {\n    pathing.init('${publicKey}');\n  }, []);\n\n  return (\n    <>\n      <Component {...pageProps} />\n    </>\n  );\n}`,
        },
        {
            name: "JavaScript",
            icon: "js",
            code: (publicKey: string) =>
                `// ESM import (recommended)
import { pathing } from 'pathingjs';

// Initialize with your API key
pathing.init('${publicKey}');

// Track a custom event
pathing.link.button(document.getElementById('my-button'), {
    event: 'button_clicked',
    data: {
        button_id: 'my-button',
        button_text: 'Click me',
        button_color: 'blue'
    }
});`,
        },
        {
            name: "Next.js",
            icon: "nextjs",
            code: (publicKey: string) =>
                `// Install the package\nnpm install pathingjs\n\n` +
                `// In your _app.js or _app.tsx\nimport { pathing } from 'pathingjs';\n\n` +
                `export default function App({ Component, pageProps }) {\n  return (\n    <>\n      {/* Initialize Pathing.js */}\n      <script dangerouslySetInnerHTML={{\n        __html: \`\n          (function() {\n            window.pathing && window.pathing.init('${publicKey}');\n          })();\n        \`,\n      }} />\n      <Component {...pageProps} />\n    </>\n  );\n}`,
        },
        {
            name: "TypeScript",
            icon: "ts",
            code: (publicKey: string) =>
                `// Install the package\nnpm install pathingjs\n\n` +
                `// Import with types\nimport { pathing, ButtonData, EventResponse } from 'pathingjs';\n\n` +
                `// Initialize with your API key\npathing.init('${publicKey}');\n\n` +
                `// TypeScript example\nfunction trackButtonClick(data: ButtonData): Promise<EventResponse> {\n  return pathing.send.button(data);\n}`,
        },
    ];

    useEffect(() => {
        fetchDomains();
    }, []);

    async function fetchDomains() {
        try {
            setLoading(true);
            const { data, error } = await supabase.from("domains").select("*");

            if (error) throw error;
            setDomains(data || []);
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("An unknown error occurred");
            }
        } finally {
            setLoading(false);
        }
    }

    async function deleteDomain(id: string) {
        const domain = domains.find((d) => d.id === id);
        if (domain) {
            setDomainToDelete(domain);
            setShowDeleteModal(true);
            setDeleteConfirmation("");
        }
    }

    async function confirmDeletion() {
        if (!domainToDelete) return;

        try {
            setIsDeleting(true);
            setError(null);

            // First delete all events related to this domain
            const { error: eventsError } = await supabase
                .from("events")
                .delete()
                .eq("domain_id", domainToDelete.id);

            if (eventsError) throw eventsError;

            // Then delete the domain itself
            const { error } = await supabase
                .from("domains")
                .delete()
                .eq("id", domainToDelete.id);

            if (error) throw error;

            setDomains(
                domains.filter((domain) => domain.id !== domainToDelete.id)
            );
            setSuccess("Domain and all its data deleted successfully");
            setShowDeleteModal(false);
            setDomainToDelete(null);
            setDeleteConfirmation("");

            // Clear success message after 3 seconds
            setTimeout(() => setSuccess(null), 3000);
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("An unknown error occurred");
            }

            // Clear error message after 3 seconds
            setTimeout(() => setError(null), 3000);
        } finally {
            setIsDeleting(false);
        }
    }

    async function verifyDomain(id: string) {
        try {
            setVerifyingDomain(id);
            setError(null);

            const response = await fetch("/api/domains/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ domainId: id }),
            });

            const result = await response.json();

            if (result.success) {
                // Update the domain in the local state
                setDomains(
                    domains.map((domain) =>
                        domain.id === id
                            ? {
                                  ...domain,
                                  verified: true,
                                  verified_at: new Date().toISOString(),
                              }
                            : domain
                    )
                );
                setSuccess(result.message);
            } else {
                setError(result.error);
            }

            // Clear messages after 3 seconds
            setTimeout(() => {
                setSuccess(null);
                setError(null);
            }, 3000);
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("An unknown error occurred");
            }
            setTimeout(() => setError(null), 3000);
        } finally {
            setVerifyingDomain(null);
        }
    }

    const toggleConfigVisibility = (domainId: string) => {
        setVisibleConfig((prev) => ({ ...prev, [domainId]: !prev[domainId] }));
    };

    const setInstallTab = (domainId: string, tabName: string) => {
        setActiveInstallTab((prev) => ({ ...prev, [domainId]: tabName }));
    };

    return (
        <div className="bg-white/70 dark:bg-[#23233a]/70 rounded-xl shadow-lg p-8 border border-white/20 dark:border-white/5 w-full mb-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Your Domains</h2>
                <Link
                    href="/dashboard/add-domain"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
                >
                    Add New Domain
                </Link>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
                    {error}
                </div>
            )}

            {success && (
                <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-300">
                    {success}
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && domainToDelete && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-[#23233a] p-6 rounded-xl shadow-lg max-w-lg w-full mx-4">
                        <div className="flex items-center gap-3 text-red-600 mb-4">
                            <ExclamationTriangleIcon className="w-6 h-6" />
                            <h3 className="text-xl font-bold">
                                Delete Website
                            </h3>
                        </div>

                        <div className="mb-6">
                            <p className="mb-4">
                                This action is{" "}
                                <span className="font-bold">irreversible</span>.
                                All data for{" "}
                                <span className="font-semibold">
                                    {domainToDelete.name}
                                </span>{" "}
                                will be permanently deleted, including:
                            </p>
                            <ul className="list-disc list-inside mb-4 text-sm">
                                <li>All analytics data and events</li>
                                <li>Website configuration</li>
                                <li>API keys</li>
                            </ul>
                            <p className="text-sm bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800">
                                To confirm, type{" "}
                                <span className="font-mono font-bold">
                                    YES, DELETE MY WEBSITE {domainToDelete.name}
                                </span>{" "}
                                below.
                            </p>
                        </div>

                        <input
                            type="text"
                            value={deleteConfirmation}
                            onChange={(e) =>
                                setDeleteConfirmation(e.target.value)
                            }
                            placeholder={`YES, DELETE MY WEBSITE ${domainToDelete.name}`}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white/90 dark:bg-[#181824]/90 focus:outline-none focus:ring-2 focus:ring-red-500 mb-4"
                        />

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setDomainToDelete(null);
                                    setDeleteConfirmation("");
                                }}
                                className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg"
                                disabled={isDeleting}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDeletion}
                                disabled={
                                    deleteConfirmation !==
                                        `YES, DELETE MY WEBSITE ${domainToDelete.name}` ||
                                    isDeleting
                                }
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isDeleting ? (
                                    <>
                                        <svg
                                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        Deleting...
                                    </>
                                ) : (
                                    <>
                                        <TrashIcon className="w-4 h-4" />
                                        Delete Forever
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {loading ? (
                <div className="text-gray-500 dark:text-gray-400 text-center py-8">
                    Loading domains...
                </div>
            ) : domains.length === 0 ? (
                <div className="text-gray-500 dark:text-gray-400 text-center py-8 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                    No domains added yet. Add your first domain to get started.
                </div>
            ) : (
                <div className="space-y-4">
                    {domains.map((domain) => (
                        <div
                            key={domain.id}
                            className="p-4 bg-white/40 dark:bg-[#212134]/40 rounded-lg border border-gray-200 dark:border-gray-800"
                        >
                            <div className="flex justify-between items-center mb-3">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-semibold text-lg">
                                        {domain.name}
                                    </h3>
                                    {domain.verified ? (
                                        <div
                                            className="text-green-600 dark:text-green-400 tooltip flex items-center"
                                            data-tip="Domain verified"
                                        >
                                            <ShieldCheckIcon className="w-5 h-5" />
                                        </div>
                                    ) : (
                                        <div
                                            className="text-yellow-600 dark:text-yellow-400 tooltip flex items-center"
                                            data-tip="Domain not verified"
                                        >
                                            <ShieldExclamationIcon className="w-5 h-5" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    {domain.verified && (
                                        <Link
                                            href={`/dashboard?domain=${domain.id}`}
                                            className="text-blue-500 hover:text-blue-700 p-1 text-sm"
                                        >
                                            View Analytics
                                        </Link>
                                    )}
                                    <button
                                        onClick={() => deleteDomain(domain.id)}
                                        className="text-red-500 hover:text-red-700 p-1"
                                        aria-label="Delete domain"
                                    >
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {!domain.verified && (
                                <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                                    <h4 className="font-medium text-yellow-800 dark:text-yellow-300 flex items-center gap-1 mb-2">
                                        <InformationCircleIcon className="w-5 h-5" />
                                        Verify Domain Ownership
                                    </h4>
                                    <p className="text-sm text-yellow-700 dark:text-yellow-400 mb-2">
                                        Create a TXT record with the following
                                        values:
                                    </p>
                                    <div className="bg-white/80 dark:bg-gray-800/80 p-3 rounded text-sm mb-3">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <span className="text-gray-500 dark:text-gray-400">
                                                    Type:
                                                </span>
                                                <span className="font-mono ml-2">
                                                    TXT
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500 dark:text-gray-400">
                                                    Host:
                                                </span>
                                                <span className="font-mono ml-2">
                                                    @
                                                </span>
                                            </div>
                                            <div className="col-span-2">
                                                <span className="text-gray-500 dark:text-gray-400">
                                                    Value:
                                                </span>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <CopyButton
                                                        text={
                                                            domain.verification_token
                                                        }
                                                        className="text-blue-500 hover:text-blue-700 p-1 flex items-center gap-1 text-sm"
                                                        iconClassName="w-4 h-4"
                                                        showText={false}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-xs text-yellow-700 dark:text-yellow-400 mb-3">
                                        DNS changes may take up to 24-48 hours
                                        to propagate. You can try to{" "}
                                        <a
                                            href="https://developers.google.com/speed/public-dns/cache"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="underline hover:text-yellow-500 dark:hover:text-yellow-300"
                                        >
                                            flush the cache
                                        </a>{" "}
                                        to potentially speed this up.
                                    </p>
                                    <button
                                        onClick={() => verifyDomain(domain.id)}
                                        disabled={verifyingDomain === domain.id}
                                        className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg flex items-center gap-1 text-sm font-medium transition-colors disabled:opacity-50"
                                    >
                                        {verifyingDomain === domain.id
                                            ? "Verifying..."
                                            : "Verify Now"}
                                    </button>
                                </div>
                            )}

                            {/* Toggle Configuration Button */}
                            <div className="mt-4 mb-3">
                                <button
                                    onClick={() =>
                                        toggleConfigVisibility(domain.id)
                                    }
                                    className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium py-1"
                                >
                                    {visibleConfig[domain.id] ? (
                                        <>
                                            <ChevronUpIcon className="w-4 h-4" />
                                            Hide Configuration
                                        </>
                                    ) : (
                                        <>
                                            <ChevronDownIcon className="w-4 h-4" />
                                            Show Configuration
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Conditionally render Public Key and Snippet */}
                            {visibleConfig[domain.id] && (
                                <>
                                    <div className="mb-3">
                                        <div className="flex items-center justify-between mb-1">
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                Public Key
                                            </div>
                                            <CopyButton
                                                text={domain.public_key}
                                                className="text-blue-500 hover:text-blue-700 p-1 flex items-center gap-1 text-sm"
                                                iconClassName="w-4 h-4"
                                                showText={true}
                                            />
                                        </div>
                                        <div className="font-mono text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-x-auto">
                                            {domain.public_key}
                                        </div>
                                    </div>

                                    {/* Ways to Install Section */}
                                    <div className="mb-4 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                                        <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                                            <h4 className="font-medium flex items-center gap-2">
                                                <CodeBracketIcon className="w-5 h-5 text-blue-500" />
                                                Ways to Install
                                            </h4>
                                        </div>

                                        {/* Installation Tabs */}
                                        <div className="border-b border-gray-200 dark:border-gray-700">
                                            <nav className="flex overflow-x-auto">
                                                {installOptions.map(
                                                    (option) => (
                                                        <button
                                                            key={option.name}
                                                            onClick={() =>
                                                                setInstallTab(
                                                                    domain.id,
                                                                    option.name
                                                                )
                                                            }
                                                            className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                                                                activeInstallTab[
                                                                    domain.id
                                                                ] ===
                                                                    option.name ||
                                                                (!activeInstallTab[
                                                                    domain.id
                                                                ] &&
                                                                    option.name ===
                                                                        installOptions[0]
                                                                            .name)
                                                                    ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                                                                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                                                            }`}
                                                        >
                                                            <span className="flex items-center gap-2">
                                                                <span
                                                                    className={`w-5 h-5 flex items-center justify-center rounded bg-gray-200 dark:bg-gray-700 text-xs font-bold ${
                                                                        option.icon ===
                                                                        "html"
                                                                            ? "text-orange-500"
                                                                            : option.icon ===
                                                                              "react"
                                                                            ? "text-blue-400"
                                                                            : option.icon ===
                                                                              "js"
                                                                            ? "text-yellow-500"
                                                                            : option.icon ===
                                                                              "nextjs"
                                                                            ? "text-black dark:text-white"
                                                                            : option.icon ===
                                                                              "ts"
                                                                            ? "text-blue-600"
                                                                            : ""
                                                                    }`}
                                                                >
                                                                    {option.icon ===
                                                                    "html"
                                                                        ? "H"
                                                                        : option.icon ===
                                                                          "react"
                                                                        ? "R"
                                                                        : option.icon ===
                                                                          "js"
                                                                        ? "JS"
                                                                        : option.icon ===
                                                                          "nextjs"
                                                                        ? "N"
                                                                        : option.icon ===
                                                                          "ts"
                                                                        ? "TS"
                                                                        : ""}
                                                                </span>
                                                                {option.name}
                                                            </span>
                                                        </button>
                                                    )
                                                )}
                                            </nav>
                                        </div>

                                        {/* Installation Code */}
                                        {installOptions.map((option) => {
                                            const isActive =
                                                activeInstallTab[domain.id] ===
                                                    option.name ||
                                                (!activeInstallTab[domain.id] &&
                                                    option.name ===
                                                        installOptions[0].name);

                                            if (!isActive) return null;

                                            const snippetCode = option.code(
                                                domain.public_key
                                            );

                                            // Split code into sections based on comments for better presentation
                                            const codeLines =
                                                snippetCode.split("\n");
                                            const sections: Array<{
                                                type: "code" | "comment";
                                                lines: string[];
                                            }> = [];
                                            let currentSection: {
                                                type: "code" | "comment";
                                                lines: string[];
                                            } = { type: "code", lines: [] };

                                            codeLines.forEach((line) => {
                                                if (
                                                    line
                                                        .trim()
                                                        .startsWith("// ")
                                                ) {
                                                    if (
                                                        currentSection.lines
                                                            .length > 0
                                                    ) {
                                                        sections.push({
                                                            ...currentSection,
                                                        });
                                                        currentSection = {
                                                            type: "code",
                                                            lines: [],
                                                        };
                                                    }
                                                    sections.push({
                                                        type: "comment",
                                                        lines: [line],
                                                    });
                                                } else {
                                                    currentSection.lines.push(
                                                        line
                                                    );
                                                }
                                            });

                                            if (
                                                currentSection.lines.length > 0
                                            ) {
                                                sections.push(currentSection);
                                            }

                                            return (
                                                <div
                                                    key={option.name}
                                                    className="p-4"
                                                >
                                                    <div className="flex items-center justify-between mb-3">
                                                        <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                                                            {option.name}{" "}
                                                            Integration
                                                        </span>
                                                        <CopyButton
                                                            text={snippetCode}
                                                            className="bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-800/50 text-blue-600 dark:text-blue-400 px-2 py-1 rounded flex items-center gap-1 text-sm transition-colors"
                                                            iconClassName="w-4 h-4"
                                                            showText={true}
                                                            defaultText="Copy Code"
                                                            successText="Copied!"
                                                        />
                                                    </div>

                                                    <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                                                        {sections.map(
                                                            (section, idx) => (
                                                                <div
                                                                    key={idx}
                                                                    className={`${
                                                                        section.type ===
                                                                        "comment"
                                                                            ? "bg-gray-100 dark:bg-gray-800 px-4 py-2 text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 font-medium"
                                                                            : "font-mono text-sm p-4 overflow-x-auto"
                                                                    }`}
                                                                >
                                                                    {section.type ===
                                                                    "comment" ? (
                                                                        <div>
                                                                            {section.lines[0]
                                                                                .replace(
                                                                                    "//",
                                                                                    ""
                                                                                )
                                                                                .trim()}
                                                                        </div>
                                                                    ) : (
                                                                        <pre className="whitespace-pre text-blue-800 dark:text-blue-300">
                                                                            {section.lines.join(
                                                                                "\n"
                                                                            )}
                                                                        </pre>
                                                                    )}
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}

                                        {/* Documentation CTA */}
                                        <div className="px-4 py-3 bg-blue-50 dark:bg-blue-900/20 border-t border-blue-100 dark:border-blue-800 flex items-center justify-between">
                                            <span className="text-sm text-blue-700 dark:text-blue-300">
                                                Need more detailed installation
                                                instructions?
                                            </span>
                                            <Link
                                                href="/documentation/installation"
                                                className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                            >
                                                <DocumentTextIcon className="w-4 h-4" />
                                                Read the docs
                                            </Link>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
