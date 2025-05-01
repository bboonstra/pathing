import { createServerSupabaseClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import SignOutButton from "./SignOutButton";

export default async function DashboardPage() {
    const supabase = await createServerSupabaseClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-100 dark:from-[#0a0a0a] dark:via-[#181824] dark:to-[#1a1a2e] flex flex-col items-center py-16 px-4">
            <div className="w-full max-w-3xl">
                <div className="bg-white/80 dark:bg-[#181824]/80 rounded-2xl shadow-2xl p-10 border border-white/30 dark:border-white/10 mb-8 flex items-center justify-between">
                    <h1 className="text-3xl font-extrabold mb-2 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-400 bg-clip-text text-transparent">
                        Welcome, {user.email}
                    </h1>
                    <SignOutButton />
                </div>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                    Your analytics dashboard is ready to grow with you.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white/70 dark:bg-[#23233a]/70 rounded-xl shadow-lg p-8 border border-white/20 dark:border-white/5 flex flex-col items-center justify-center min-h-[180px]">
                        <span className="text-2xl font-bold text-gray-400 dark:text-gray-600 mb-2">
                            🚧
                        </span>
                        <span className="text-lg text-gray-500 dark:text-gray-400 text-center">
                            Your analytics will appear here soon.
                            <br />
                            Start sending events to see the magic!
                        </span>
                    </div>
                    <div className="bg-white/70 dark:bg-[#23233a]/70 rounded-xl shadow-lg p-8 border border-white/20 dark:border-white/5 flex flex-col items-center justify-center min-h-[180px]">
                        <span className="text-2xl font-bold text-gray-400 dark:text-gray-600 mb-2">
                            ✨
                        </span>
                        <span className="text-lg text-gray-500 dark:text-gray-400 text-center">
                            More insights and charts coming soon.
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
