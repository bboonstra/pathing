"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
    TrashIcon,
    ClipboardIcon,
    CheckCircleIcon,
    ShieldCheckIcon,
    ShieldExclamationIcon,
    InformationCircleIcon,
    ExclamationTriangleIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";

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

export default function DomainList() {
    const [domains, setDomains] = useState<Domain[]>([]);
    const [loading, setLoading] = useState(true);
    const [verifyingDomain, setVerifyingDomain] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [copySuccess, setCopySuccess] = useState<string | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [domainToDelete, setDomainToDelete] = useState<Domain | null>(null);
    const [deleteConfirmation, setDeleteConfirmation] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

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

    function copyToClipboard(text: string, id: string) {
        navigator.clipboard.writeText(text);
        setCopySuccess(id);
        setTimeout(() => setCopySuccess(null), 2000);
    }

    function getSnippet(publicKey: string) {
        return `<script src="${window.location.origin}/pathing.js" pathing-api-key="${publicKey}"></script>`;
    }

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
                                            href={`/dashboard/analytics?domain=${domain.id}`}
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
                                                    <code className="font-mono text-xs bg-gray-100 dark:bg-gray-900 p-1 rounded flex-1 break-all">
                                                        {
                                                            domain.verification_token
                                                        }
                                                    </code>
                                                    <button
                                                        onClick={() =>
                                                            copyToClipboard(
                                                                domain.verification_token,
                                                                `token-${domain.id}`
                                                            )
                                                        }
                                                        className="text-blue-500 hover:text-blue-700 p-1 flex items-center gap-1 text-sm"
                                                    >
                                                        {copySuccess ===
                                                        `token-${domain.id}` ? (
                                                            <CheckCircleIcon className="w-4 h-4" />
                                                        ) : (
                                                            <ClipboardIcon className="w-4 h-4" />
                                                        )}
                                                    </button>
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

                            <div className="mb-3">
                                <div className="flex items-center justify-between mb-1">
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        Public Key
                                    </div>
                                    <button
                                        onClick={() =>
                                            copyToClipboard(
                                                domain.public_key,
                                                `key-${domain.id}`
                                            )
                                        }
                                        className="text-blue-500 hover:text-blue-700 p-1 flex items-center gap-1 text-sm"
                                    >
                                        {copySuccess === `key-${domain.id}` ? (
                                            <>
                                                <CheckCircleIcon className="w-4 h-4" />{" "}
                                                Copied!
                                            </>
                                        ) : (
                                            <>
                                                <ClipboardIcon className="w-4 h-4" />{" "}
                                                Copy
                                            </>
                                        )}
                                    </button>
                                </div>
                                <div className="font-mono text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-x-auto">
                                    {domain.public_key}
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        Installation Snippet
                                    </div>
                                    <button
                                        onClick={() =>
                                            copyToClipboard(
                                                getSnippet(domain.public_key),
                                                `snippet-${domain.id}`
                                            )
                                        }
                                        className="text-blue-500 hover:text-blue-700 p-1 flex items-center gap-1 text-sm"
                                    >
                                        {copySuccess ===
                                        `snippet-${domain.id}` ? (
                                            <>
                                                <CheckCircleIcon className="w-4 h-4" />{" "}
                                                Copied!
                                            </>
                                        ) : (
                                            <>
                                                <ClipboardIcon className="w-4 h-4" />{" "}
                                                Copy
                                            </>
                                        )}
                                    </button>
                                </div>
                                <div className="font-mono text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-x-auto">
                                    {getSnippet(domain.public_key)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
