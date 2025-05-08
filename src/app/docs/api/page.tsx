"use client";

import { useState } from "react";
import { ClipboardIcon, CheckCircleIcon } from "@heroicons/react/24/solid";

export default function ApiReference() {
    const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

    const copyToClipboard = (text: string, snippetId: string) => {
        navigator.clipboard.writeText(text);
        setCopiedSnippet(snippetId);
        setTimeout(() => setCopiedSnippet(null), 2000);
    };

    return (
        <>
            <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-600 via-purple-600 to-blue-400 bg-clip-text text-transparent">
                API Reference
            </h1>

            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6 border-b pb-2">
                    Core Objects
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-100 dark:border-gray-800 p-6 hover:shadow-lg transition-shadow">
                        <h3 className="text-xl font-bold mb-3 text-blue-600 dark:text-blue-400">
                            Parameter
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                            A class for adding metadata to event properties.
                        </p>
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 relative">
                            <pre className="overflow-x-auto text-blue-700 dark:text-blue-300 text-sm">
                                {`new pathing.Parameter(
  label: string, 
  key: string, 
  value: any
)`}
                            </pre>
                            <button
                                className="absolute top-2 right-2 p-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                                onClick={() =>
                                    copyToClipboard(
                                        `new pathing.Parameter(
  label: string, 
  key: string, 
  value: any
)`,
                                        "parameter-code"
                                    )
                                }
                                aria-label="Copy code"
                            >
                                {copiedSnippet === "parameter-code" ? (
                                    <CheckCircleIcon className="h-5 w-5" />
                                ) : (
                                    <ClipboardIcon className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-100 dark:border-gray-800 p-6 hover:shadow-lg transition-shadow">
                        <h3 className="text-xl font-bold mb-3 text-purple-600 dark:text-purple-400">
                            Config
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                            Configuration object for customizing tracking
                            behavior.
                        </p>
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 relative">
                            <pre className="overflow-x-auto text-blue-700 dark:text-blue-300 text-sm">
                                {`pathing.config({
  trackPageviews: boolean,
  trackClicks: boolean,
  trackForms: boolean,
  respectDNT: boolean
})`}
                            </pre>
                            <button
                                className="absolute top-2 right-2 p-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                                onClick={() =>
                                    copyToClipboard(
                                        `pathing.config({
  trackPageviews: boolean,
  trackClicks: boolean,
  trackForms: boolean,
  respectDNT: boolean
})`,
                                        "config-code"
                                    )
                                }
                                aria-label="Copy code"
                            >
                                {copiedSnippet === "config-code" ? (
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
                <h2 className="text-2xl font-bold mb-6 border-b pb-2">
                    Events API
                </h2>

                <div className="space-y-8">
                    <div>
                        <h3 className="text-xl font-semibold mb-3">
                            send.purchase
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                            Tracks a purchase or conversion event.
                        </p>
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-4 relative">
                            <pre className="overflow-x-auto text-blue-700 dark:text-blue-300 text-sm">
                                {`pathing.send.purchase({
  product: string | Parameter,
  price: number | Parameter,
  currency?: string | Parameter,
  quantity?: number | Parameter,
  category?: string | Parameter
}): Promise<void>`}
                            </pre>
                            <button
                                className="absolute top-2 right-2 p-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                                onClick={() =>
                                    copyToClipboard(
                                        `pathing.send.purchase({
  product: string | Parameter,
  price: number | Parameter,
  currency?: string | Parameter,
  quantity?: number | Parameter,
  category?: string | Parameter
}): Promise<void>`,
                                        "purchase-code"
                                    )
                                }
                                aria-label="Copy code"
                            >
                                {copiedSnippet === "purchase-code" ? (
                                    <CheckCircleIcon className="h-5 w-5" />
                                ) : (
                                    <ClipboardIcon className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold mb-3">
                            send.playback
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                            Tracks media playback events (video/audio).
                        </p>
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-4 relative">
                            <pre className="overflow-x-auto text-blue-700 dark:text-blue-300 text-sm">
                                {`pathing.send.playback({
  content: string | Parameter,
  duration: number | Parameter,
  progress: number | Parameter, // 0-1 ratio
  action?: 'play' | 'pause' | 'seek' | 'complete' | string | Parameter
}): Promise<void>`}
                            </pre>
                            <button
                                className="absolute top-2 right-2 p-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                                onClick={() =>
                                    copyToClipboard(
                                        `pathing.send.playback({
  content: string | Parameter,
  duration: number | Parameter,
  progress: number | Parameter, // 0-1 ratio
  action?: 'play' | 'pause' | 'seek' | 'complete' | string | Parameter
}): Promise<void>`,
                                        "playback-code"
                                    )
                                }
                                aria-label="Copy code"
                            >
                                {copiedSnippet === "playback-code" ? (
                                    <CheckCircleIcon className="h-5 w-5" />
                                ) : (
                                    <ClipboardIcon className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold mb-3">send.raw</h3>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                            Tracks any custom event type.
                        </p>
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-4 relative">
                            <pre className="overflow-x-auto text-blue-700 dark:text-blue-300 text-sm">
                                {`pathing.send.raw(
  type: string, 
  data: Record<string, any>
): Promise<void>`}
                            </pre>
                            <button
                                className="absolute top-2 right-2 p-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                                onClick={() =>
                                    copyToClipboard(
                                        `pathing.send.raw(
  type: string, 
  data: Record<string, any>
): Promise<void>`,
                                        "raw-code"
                                    )
                                }
                                aria-label="Copy code"
                            >
                                {copiedSnippet === "raw-code" ? (
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
                <h2 className="text-2xl font-bold mb-6 border-b pb-2">
                    Element Binding API
                </h2>

                <div className="space-y-8">
                    <div>
                        <h3 className="text-xl font-semibold mb-3">
                            link.purchase
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                            Bind purchase tracking to an element&apos;s click
                            event.
                        </p>
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-4 relative">
                            <pre className="overflow-x-auto text-blue-700 dark:text-blue-300 text-sm">
                                {`pathing.link.purchase(
  element: HTMLElement,
  data: Record<string, any>,
  options?: { preventDefault?: boolean }
): HTMLElement`}
                            </pre>
                            <button
                                className="absolute top-2 right-2 p-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                                onClick={() =>
                                    copyToClipboard(
                                        `pathing.link.purchase(
  element: HTMLElement,
  data: Record<string, any>,
  options?: { preventDefault?: boolean }
): HTMLElement`,
                                        "link-purchase-code"
                                    )
                                }
                                aria-label="Copy code"
                            >
                                {copiedSnippet === "link-purchase-code" ? (
                                    <CheckCircleIcon className="h-5 w-5" />
                                ) : (
                                    <ClipboardIcon className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold mb-3">
                            link.playback
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                            Bind playback tracking to a media element.
                        </p>
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-4 relative">
                            <pre className="overflow-x-auto text-blue-700 dark:text-blue-300 text-sm">
                                {`pathing.link.playback(
  element: HTMLMediaElement,
  data: Record<string, any>
): HTMLMediaElement`}
                            </pre>
                            <button
                                className="absolute top-2 right-2 p-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                                onClick={() =>
                                    copyToClipboard(
                                        `pathing.link.playback(
  element: HTMLMediaElement,
  data: Record<string, any>
): HTMLMediaElement`,
                                        "link-playback-code"
                                    )
                                }
                                aria-label="Copy code"
                            >
                                {copiedSnippet === "link-playback-code" ? (
                                    <CheckCircleIcon className="h-5 w-5" />
                                ) : (
                                    <ClipboardIcon className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold mb-3">link.raw</h3>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                            Bind any custom event to an element.
                        </p>
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-4 relative">
                            <pre className="overflow-x-auto text-blue-700 dark:text-blue-300 text-sm">
                                {`pathing.link.raw(
  element: HTMLElement,
  type: string,
  data: Record<string, any>,
  options?: { preventDefault?: boolean }
): HTMLElement`}
                            </pre>
                            <button
                                className="absolute top-2 right-2 p-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                                onClick={() =>
                                    copyToClipboard(
                                        `pathing.link.raw(
  element: HTMLElement,
  type: string,
  data: Record<string, any>,
  options?: { preventDefault?: boolean }
): HTMLElement`,
                                        "link-raw-code"
                                    )
                                }
                                aria-label="Copy code"
                            >
                                {copiedSnippet === "link-raw-code" ? (
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
                <h2 className="text-2xl font-bold mb-6 border-b pb-2">
                    Framework Integration
                </h2>

                <div className="space-y-8">
                    <div>
                        <h3 className="text-xl font-semibold mb-3">React</h3>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                            Using with React for automatic route tracking.
                        </p>
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-4 relative">
                            <pre className="overflow-x-auto text-blue-700 dark:text-blue-300 text-sm">
                                {`// components/PathingTracker.tsx
'use client';
  
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function PathingTracker() {
  const pathname = usePathname();
  
  useEffect(() => {
    if (window.pathing && pathname) {
      window.pathing.send.raw("pageview", {
        path: pathname,
        title: document.title,
        isVirtualPageview: true
      });
    }
  }, [pathname]);

  return null;
}

// Add <PathingTracker /> to your layout.tsx
`}
                            </pre>
                            <button
                                className="absolute top-2 right-2 p-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                                onClick={() =>
                                    copyToClipboard(
                                        `// components/PathingTracker.tsx
'use client';
  
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function PathingTracker() {
  const pathname = usePathname();
  
  useEffect(() => {
    if (window.pathing && pathname) {
      window.pathing.send.raw("pageview", {
        path: pathname,
        title: document.title,
        isVirtualPageview: true
      });
    }
  }, [pathname]);

  return null;
}

// Add <PathingTracker /> to your layout.tsx`,
                                        "react-code"
                                    )
                                }
                                aria-label="Copy code"
                            >
                                {copiedSnippet === "react-code" ? (
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
