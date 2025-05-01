"use client";
import { supabase } from "@/lib/supabase";
import AuthCallbackHandler from "./AuthCallbackHandler";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Suspense } from "react";

export default function LoginPage() {
    const router = useRouter();

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                router.replace("/dashboard");
            }
        });
        // Optionally, listen for auth changes as well
        const { data: listener } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                if (session) {
                    router.replace("/dashboard");
                }
            }
        );
        return () => {
            listener?.subscription.unsubscribe();
        };
    }, [router]);

    const signIn = async () => {
        await supabase.auth.signInWithOAuth({
            provider: "github",
            options: {
                redirectTo: `${window.location.origin}/login`,
            },
        });
    };

    return (
        <>
            <Suspense fallback={null}>
                <AuthCallbackHandler />
            </Suspense>
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#181824]">
                <div className="bg-white dark:bg-[#232336] rounded-xl shadow-md p-8 flex flex-col items-center max-w-sm w-full border border-gray-200 dark:border-gray-700">
                    <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white text-center">
                        Seamless and secure login, just like our analytics.
                    </h1>

                    <p className="text-gray-500 dark:text-gray-400 mb-8 text-center">
                        One click. No passwords. No hassle.
                    </p>
                    <button
                        onClick={signIn}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow transition-all text-base flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.73 1.27 3.4.97.11-.75.41-1.27.74-1.56-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 2.9-.39c.98 0 1.97.13 2.9.39 2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.69 5.41-5.25 5.7.42.36.79 1.09.79 2.2 0 1.59-.01 2.87-.01 3.26 0 .31.21.68.8.56C20.71 21.39 24 17.08 24 12c0-6.27-5.23-11.5-12-11.5z" />
                        </svg>
                        Sign in with GitHub
                    </button>
                </div>
            </div>
        </>
    );
}
