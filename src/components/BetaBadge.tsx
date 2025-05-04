"use client";

import { useState } from "react";

export default function BetaBadge() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="w-2/5 bg-blue-100 text-blue-800 rounded-lg text-center text-sm font-medium py-1 px-2 hover:bg-blue-200 transition-all mb-9 italic"
            >
                Beta
            </button>
            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div
                        className="fixed inset-0 bg-black opacity-50"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 z-50 max-w-md mx-auto">
                        <h2 className="text-xl font-bold mb-4">Beta Access</h2>
                        <p className="mb-4">
                            Pathing is currently in beta. It may have some bugs,
                            API-breaking updates, or other issues. Your feedback
                            will help us improve. Thank you for your patience
                            and support!
                        </p>
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-all"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
