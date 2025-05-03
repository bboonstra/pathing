"use client";

import { useState } from "react";
import {
    ClipboardIcon,
    CheckCircleIcon,
    BookOpenIcon,
    BeakerIcon,
    CodeBracketIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";

export default function SDKDocumentation() {
    const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

    const copyToClipboard = (text: string, snippetId: string) => {
        navigator.clipboard.writeText(text);
        setCopiedSnippet(snippetId);
        setTimeout(() => setCopiedSnippet(null), 2000);
    };

    return (
        <>
            <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-600 via-purple-600 to-blue-400 bg-clip-text text-transparent">
                PathingJS SDK Documentation
            </h1>

            {/* Navigation Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <Link
                    href="/docs"
                    className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow flex flex-col items-center text-center border border-gray-100 dark:border-gray-800 group"
                >
                    <BookOpenIcon className="w-12 h-12 text-blue-600 dark:text-blue-400 mb-3 group-hover:scale-110 transition-transform" />
                    <h3 className="text-xl font-bold mb-2">Getting Started</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                        Core concepts and basic usage
                    </p>
                    <div className="mt-4 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium rounded-full inline-flex items-center">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1.5 animate-pulse"></span>
                        You are here
                    </div>
                </Link>

                <Link
                    href="/docs/api"
                    className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow flex flex-col items-center text-center border border-gray-100 dark:border-gray-800 group"
                >
                    <CodeBracketIcon className="w-12 h-12 text-purple-600 dark:text-purple-400 mb-3 group-hover:scale-110 transition-transform" />
                    <h3 className="text-xl font-bold mb-2">API Reference</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                        Detailed API documentation
                    </p>
                </Link>

                <Link
                    href="/docs/examples"
                    className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow flex flex-col items-center text-center border border-gray-100 dark:border-gray-800 group"
                >
                    <BeakerIcon className="w-12 h-12 text-blue-500 dark:text-blue-300 mb-3 group-hover:scale-110 transition-transform" />
                    <h3 className="text-xl font-bold mb-2">Examples</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                        Code samples and best practices
                    </p>
                </Link>
            </div>

            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-4">Installation</h2>
                <div className="bg-white dark:bg-gray-900 rounded-lg p-4 mb-4 relative">
                    <pre className="overflow-x-auto p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        <code className="text-sm text-blue-700 dark:text-blue-300">
                            {`<script src="https://cdn.pathing.co/pathing.min.js" pathing-api-key="YOUR_API_KEY"></script>`}
                        </code>
                    </pre>
                    <button
                        className="absolute top-4 right-4 p-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                        onClick={() =>
                            copyToClipboard(
                                `<script src="https://cdn.pathing.co/pathing.min.js" pathing-api-key="YOUR_API_KEY"></script>`,
                                "installation"
                            )
                        }
                        aria-label="Copy code"
                    >
                        {copiedSnippet === "installation" ? (
                            <CheckCircleIcon className="h-5 w-5" />
                        ) : (
                            <ClipboardIcon className="h-5 w-5" />
                        )}
                    </button>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                    Add this script tag to your HTML before the closing{" "}
                    <code>&lt;/body&gt;</code> tag. Replace{" "}
                    <code>YOUR_API_KEY</code> with your Pathing public API key
                    from the dashboard.
                </p>
            </section>

            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-4">Core Concepts</h2>

                <div className="space-y-6">
                    <div>
                        <h3 className="text-xl font-semibold mb-2">Events</h3>
                        <p className="mb-4 text-gray-700 dark:text-gray-300">
                            Pathing tracks user behavior through events. Events
                            have a type and a payload of data. Some event types
                            are predefined (like &quot;purchase&quot; or
                            &quot;pageview&quot;), but you can also send custom
                            events.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold mb-2">
                            Parameters
                        </h3>
                        <p className="mb-4 text-gray-700 dark:text-gray-300">
                            Parameters allow you to attach metadata to event
                            properties. This is useful for providing readable
                            labels and consistent keys for your analytics
                            dashboard.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold mb-2">
                            Auto-tracking
                        </h3>
                        <p className="mb-4 text-gray-700 dark:text-gray-300">
                            When initialized, Pathing automatically tracks
                            pageview events, capturing the current URL, page
                            title, and referrer information.
                        </p>
                    </div>
                </div>
            </section>

            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-4">API Reference</h2>

                <div className="space-y-8">
                    <div>
                        <h3 className="text-xl font-semibold mb-2">
                            Tracking Events
                        </h3>

                        <h4 className="text-lg font-medium mt-4 mb-2">
                            Predefined Events
                        </h4>
                        <div className="bg-white dark:bg-gray-900 rounded-lg p-4 mb-4 relative">
                            <pre className="overflow-x-auto p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                <code className="text-sm text-blue-700 dark:text-blue-300">
                                    {`// Track a purchase event
pathing.send.purchase({
  product: "Premium Plan",
  price: 99.99,
  currency: "USD"
});

// Track a playback event
pathing.send.playback({
  content: "Product Demo Video",
  duration: 120,
  progress: 0.75
});`}
                                </code>
                            </pre>
                            <button
                                className="absolute top-4 right-4 p-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                                onClick={() =>
                                    copyToClipboard(
                                        `pathing.send.purchase({
  product: "Premium Plan",
  price: 99.99,
  currency: "USD"
});`,
                                        "predefined-events"
                                    )
                                }
                                aria-label="Copy code"
                            >
                                {copiedSnippet === "predefined-events" ? (
                                    <CheckCircleIcon className="h-5 w-5" />
                                ) : (
                                    <ClipboardIcon className="h-5 w-5" />
                                )}
                            </button>
                        </div>

                        <h4 className="text-lg font-medium mt-4 mb-2">
                            Custom Events
                        </h4>
                        <div className="bg-white dark:bg-gray-900 rounded-lg p-4 mb-4 relative">
                            <pre className="overflow-x-auto p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                <code className="text-sm text-blue-700 dark:text-blue-300">
                                    {`// Track a custom event
pathing.send.raw("signup_completed", {
  method: "email",
  referrer: document.referrer,
  timestamp: Date.now()
});`}
                                </code>
                            </pre>
                            <button
                                className="absolute top-4 right-4 p-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                                onClick={() =>
                                    copyToClipboard(
                                        `pathing.send.raw("signup_completed", {
  method: "email",
  referrer: document.referrer,
  timestamp: Date.now()
});`,
                                        "custom-events"
                                    )
                                }
                                aria-label="Copy code"
                            >
                                {copiedSnippet === "custom-events" ? (
                                    <CheckCircleIcon className="h-5 w-5" />
                                ) : (
                                    <ClipboardIcon className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold mb-2">
                            Element Binding
                        </h3>
                        <p className="mb-4 text-gray-700 dark:text-gray-300">
                            Pathing can automatically track events when users
                            interact with DOM elements.
                        </p>

                        <h4 className="text-lg font-medium mt-4 mb-2">
                            Predefined Bindings
                        </h4>
                        <div className="bg-white dark:bg-gray-900 rounded-lg p-4 mb-4 relative">
                            <pre className="overflow-x-auto p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                <code className="text-sm text-blue-700 dark:text-blue-300">
                                    {`// Bind a purchase event to a button
const purchaseButton = document.querySelector("#purchase-button");
pathing.link.purchase(purchaseButton, {
  product: "Premium Plan",
  price: 99.99
});`}
                                </code>
                            </pre>
                            <button
                                className="absolute top-4 right-4 p-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                                onClick={() =>
                                    copyToClipboard(
                                        `const purchaseButton = document.querySelector("#purchase-button");
pathing.link.purchase(purchaseButton, {
  product: "Premium Plan",
  price: 99.99
});`,
                                        "predefined-bindings"
                                    )
                                }
                                aria-label="Copy code"
                            >
                                {copiedSnippet === "predefined-bindings" ? (
                                    <CheckCircleIcon className="h-5 w-5" />
                                ) : (
                                    <ClipboardIcon className="h-5 w-5" />
                                )}
                            </button>
                        </div>

                        <h4 className="text-lg font-medium mt-4 mb-2">
                            Custom Bindings
                        </h4>
                        <div className="bg-white dark:bg-gray-900 rounded-lg p-4 mb-4 relative">
                            <pre className="overflow-x-auto p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                <code className="text-sm text-blue-700 dark:text-blue-300">
                                    {`// Bind a custom event to an element
const signupLink = document.querySelector("#signup-link");
pathing.link.raw(signupLink, "signup_click", {
  source: "header",
  page: window.location.pathname
}, { preventDefault: true });`}
                                </code>
                            </pre>
                            <button
                                className="absolute top-4 right-4 p-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                                onClick={() =>
                                    copyToClipboard(
                                        `const signupLink = document.querySelector("#signup-link");
pathing.link.raw(signupLink, "signup_click", {
  source: "header",
  page: window.location.pathname
}, { preventDefault: true });`,
                                        "custom-bindings"
                                    )
                                }
                                aria-label="Copy code"
                            >
                                {copiedSnippet === "custom-bindings" ? (
                                    <CheckCircleIcon className="h-5 w-5" />
                                ) : (
                                    <ClipboardIcon className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold mb-2">
                            Using Parameters
                        </h3>
                        <p className="mb-4 text-gray-700 dark:text-gray-300">
                            Parameters provide metadata for properties in your
                            analytics dashboard.
                        </p>

                        <div className="bg-white dark:bg-gray-900 rounded-lg p-4 mb-4 relative">
                            <pre className="overflow-x-auto p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                <code className="text-sm text-blue-700 dark:text-blue-300">
                                    {`// Create a parameter with metadata
const productName = new pathing.Parameter(
  "Product Name", // Label displayed in the dashboard
  "product_name", // Consistent key for database/exports
  "Premium Plan"  // Actual value sent with the event
);

// Use it in an event
pathing.send.purchase({
  product: productName,
  price: 99.99
});`}
                                </code>
                            </pre>
                            <button
                                className="absolute top-4 right-4 p-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                                onClick={() =>
                                    copyToClipboard(
                                        `const productName = new pathing.Parameter(
  "Product Name", // Label displayed in the dashboard
  "product_name", // Consistent key for database/exports
  "Premium Plan"  // Actual value sent with the event
);

pathing.send.purchase({
  product: productName,
  price: 99.99
});`,
                                        "parameters"
                                    )
                                }
                                aria-label="Copy code"
                            >
                                {copiedSnippet === "parameters" ? (
                                    <CheckCircleIcon className="h-5 w-5" />
                                ) : (
                                    <ClipboardIcon className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-4">Advanced Usage</h2>

                <div className="space-y-6">
                    <div>
                        <h3 className="text-xl font-semibold mb-2">
                            TypeScript Support
                        </h3>
                        <p className="mb-4 text-gray-700 dark:text-gray-300">
                            If you&apos;re using TypeScript, you can declare the
                            Pathing global:
                        </p>

                        <div className="bg-white dark:bg-gray-900 rounded-lg p-4 mb-4 relative">
                            <pre className="overflow-x-auto p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                <code className="text-sm text-blue-700 dark:text-blue-300">
                                    {`declare global {
  interface Window {
    pathing: {
      send: {
        purchase: (data: Record<string, any>) => Promise<any>;
        playback: (data: Record<string, any>) => Promise<any>;
        raw: (type: string, data: Record<string, any>) => Promise<any>;
      };
      link: {
        purchase: (element: HTMLElement, data: Record<string, any>, options?: { preventDefault?: boolean }) => HTMLElement;
        raw: (element: HTMLElement, type: string, data: Record<string, any>, options?: { preventDefault?: boolean }) => HTMLElement;
      };
      Parameter: new (label: string, key: string, value: any) => any;
    };
  }
}`}
                                </code>
                            </pre>
                            <button
                                className="absolute top-4 right-4 p-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                                onClick={() =>
                                    copyToClipboard(
                                        `declare global {
  interface Window {
    pathing: {
      send: {
        purchase: (data: Record<string, any>) => Promise<any>;
        playback: (data: Record<string, any>) => Promise<any>;
        raw: (type: string, data: Record<string, any>) => Promise<any>;
      };
      link: {
        purchase: (element: HTMLElement, data: Record<string, any>, options?: { preventDefault?: boolean }) => HTMLElement;
        raw: (element: HTMLElement, type: string, data: Record<string, any>, options?: { preventDefault?: boolean }) => HTMLElement;
      };
      Parameter: new (label: string, key: string, value: any) => any;
    };
  }
}`,
                                        "typescript"
                                    )
                                }
                                aria-label="Copy code"
                            >
                                {copiedSnippet === "typescript" ? (
                                    <CheckCircleIcon className="h-5 w-5" />
                                ) : (
                                    <ClipboardIcon className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold mb-2">
                            CDN Fallbacks
                        </h3>
                        <p className="mb-4 text-gray-700 dark:text-gray-300">
                            For production environments, you can use various CDN
                            options:
                        </p>

                        <div className="bg-white dark:bg-gray-900 rounded-lg p-4 mb-4 relative">
                            <pre className="overflow-x-auto p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                <code className="text-sm text-blue-700 dark:text-blue-300">
                                    {`<!-- From pathing.co (primary) -->
<script src="https://cdn.pathing.co/pathing.min.js" pathing-api-key="YOUR_API_KEY"></script>

<!-- From unpkg (fallback) -->
<script src="https://unpkg.com/pathingjs@latest/dist/pathing.min.js" pathing-api-key="YOUR_API_KEY"></script>

<!-- From jsDelivr (fallback) -->
<script src="https://cdn.jsdelivr.net/npm/pathingjs@latest/dist/pathing.min.js" pathing-api-key="YOUR_API_KEY"></script>`}
                                </code>
                            </pre>
                            <button
                                className="absolute top-4 right-4 p-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                                onClick={() =>
                                    copyToClipboard(
                                        `<!-- From pathing.co (primary) -->
<script src="https://cdn.pathing.co/pathing.min.js" pathing-api-key="YOUR_API_KEY"></script>`,
                                        "cdn"
                                    )
                                }
                                aria-label="Copy code"
                            >
                                {copiedSnippet === "cdn" ? (
                                    <CheckCircleIcon className="h-5 w-5" />
                                ) : (
                                    <ClipboardIcon className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
