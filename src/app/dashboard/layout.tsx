import { createServerSupabaseClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import Navbar from "./Navbar";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Initialize Supabase client for server-side operations
    const supabase = await createServerSupabaseClient();

    // Fetch the current authenticated user
    const {
        data: { user },
    } = await supabase.auth.getUser();

    // If no user is found, redirect to the login page
    if (!user) {
        redirect("/login");
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-100 dark:from-[#0a0a0a] dark:via-[#181824] dark:to-[#1a1a2e] flex flex-col">
            {/* Render the navigation bar */}
            <Navbar />

            <div className="flex-grow flex flex-col items-center py-8 px-4">
                <div className="w-full">
                    {/* Page content will be rendered here */}
                    {children}
                </div>
            </div>
        </div>
    );
}
