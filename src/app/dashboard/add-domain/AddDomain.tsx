"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { PlusIcon } from "@heroicons/react/24/solid";
import { isValidDomainFormat, formatDomain } from "@/lib/utils/domains";

export default function AddDomain() {
    const [newDomainName, setNewDomainName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [domainFormatError, setDomainFormatError] = useState<string | null>(
        null
    );

    async function addDomain(e: React.FormEvent) {
        e.preventDefault();

        // Reset error states
        setError(null);
        setDomainFormatError(null);

        const formattedDomain = formatDomain(newDomainName);

        if (!formattedDomain.trim()) {
            setError("Please enter a valid domain name");
            return;
        }

        // Validate domain format
        if (!isValidDomainFormat(formattedDomain)) {
            setDomainFormatError(
                "Please enter a valid domain format (e.g., example.com)"
            );
            return;
        }

        try {
            setLoading(true);

            // Get current user
            const {
                data: { user },
                error: userError,
            } = await supabase.auth.getUser();

            if (userError || !user) {
                throw new Error("You must be logged in to add a domain");
            }

            // Generate a random public key
            const publicKey = generatePublicKey();
            // Generate a verification token for DNS verification
            const verificationToken = generateVerificationToken();

            const { error } = await supabase.from("domains").insert({
                name: formattedDomain,
                public_key: publicKey,
                user_id: user.id,
                verification_token: verificationToken,
                verified: false,
                verified_at: null,
            });

            if (error) throw error;

            setNewDomainName("");
            setSuccess("Domain added successfully. Please verify ownership.");

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
            setLoading(false);
        }
    }

    function generatePublicKey() {
        // Generate a random string for public key
        return (
            "pk_" +
            Array.from(crypto.getRandomValues(new Uint8Array(24)))
                .map((b) => b.toString(16).padStart(2, "0"))
                .join("")
        );
    }

    function generateVerificationToken() {
        return (
            "pathing-verify-" +
            Array.from(crypto.getRandomValues(new Uint8Array(16)))
                .map((b) => b.toString(16).padStart(2, "0"))
                .join("")
        );
    }

    return (
        <div className="bg-white/70 dark:bg-[#23233a]/70 rounded-xl shadow-lg p-8 border border-white/20 dark:border-white/5 w-full mb-8">
            <h2 className="text-xl font-bold mb-6">Add New Domain</h2>

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

            <form onSubmit={addDomain} className="mb-6">
                <div className="mb-4">
                    <label
                        htmlFor="domain-name"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                        Domain Name
                    </label>
                    <input
                        id="domain-name"
                        type="text"
                        value={newDomainName}
                        onChange={(e) => setNewDomainName(e.target.value)}
                        placeholder="example.com"
                        className={`w-full px-4 py-2 border ${
                            domainFormatError
                                ? "border-red-300 dark:border-red-700"
                                : "border-gray-300 dark:border-gray-700"
                        } rounded-lg bg-white/90 dark:bg-[#181824]/90 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        required
                    />
                    {domainFormatError && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                            {domainFormatError}
                        </p>
                    )}
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2 font-medium transition-colors disabled:opacity-50"
                >
                    {loading ? (
                        "Adding Domain..."
                    ) : (
                        <>
                            <PlusIcon className="w-5 h-5" />
                            Add Domain
                        </>
                    )}
                </button>
            </form>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                <h3 className="text-blue-800 dark:text-blue-300 font-medium mb-2">
                    After adding a domain
                </h3>
                <p className="text-blue-700 dark:text-blue-400 text-sm mb-2">
                    Once your domain is added, you will need to:
                </p>
                <ol className="list-decimal list-inside text-sm text-blue-700 dark:text-blue-400 space-y-1 ml-2">
                    <li>Verify domain ownership by adding a DNS TXT record</li>
                    <li>Add the tracking script to your website</li>
                    <li>View analytics on your dashboard</li>
                </ol>
            </div>
        </div>
    );
}
