"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";

const Feedback = () => {
    const [feedback, setFeedback] = useState("");
    const [message, setMessage] = useState("");
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        // Assuming you have a way to get the current user's ID
        const fetchUserId = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            setUserId(user?.id || null);
        };
        fetchUserId();
    }, []);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!userId) {
            setMessage("User not logged in");
            return;
        }
        const { error } = await supabase
            .from("feedback")
            .insert([{ feedback, user_id: userId }]);

        if (error) {
            setMessage("Error submitting feedback");
        } else {
            setMessage("Feedback submitted successfully!");
            setFeedback("");
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-md overflow-hidden md:max-w-2xl p-6">
            <h1 className="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-gray-200">
                Feedback
            </h1>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-4">
                We value your feedback as we are currently in beta. Your
                insights help us grow and improve our service. Thank you for
                taking the time to share your thoughts with us.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
                <textarea
                    className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Enter your feedback"
                    required
                />
                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-all focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-500"
                >
                    Submit
                </button>
            </form>
            {message && (
                <p className="mt-4 text-center text-gray-700 dark:text-gray-300">
                    {message}
                </p>
            )}
        </div>
    );
};

export default Feedback;
