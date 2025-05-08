"use client";

import CopyButton from "@/components/CopyButton";

export default function SDKDocumentation() {
    return (
        <>
            <h1 className="text-4xl font-bold mb-8 mt-20 text-center bg-gradient-to-r from-blue-600 via-purple-600 to-blue-400 bg-clip-text text-transparent">
                PathingJS SDK Documentation
            </h1>

            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-4">Installation</h2>
                <div className="bg-white dark:bg-gray-900 rounded-lg p-4 mb-4 relative">
                    <div className="relative">
                        <pre className="bg-gray-100 dark:bg-gray-800 rounded p-4 text-sm sm:text-base text-blue-700 dark:text-blue-200 overflow-x-auto whitespace-pre-wrap break-all sm:whitespace-pre sm:break-normal">
                            <code>{`<script src="https://cdn.pathing.co/pathing.min.js" pathing-api-key="YOUR_API_KEY"></script>`}</code>
                        </pre>
                        <CopyButton
                            text={`<script src="https://cdn.pathing.co/pathing.min.js" pathing-api-key="YOUR_API_KEY"></script>`}
                            className="absolute top-2 right-2 p-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-600 hover:bg-blue-700 text-white"
                            iconClassName="w-5 h-5"
                            showText={true}
                            defaultText="Copy"
                            successText="Copied!"
                        />
                    </div>
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
                            <div className="relative">
                                <pre className="bg-gray-100 dark:bg-gray-800 rounded p-4 text-sm sm:text-base text-blue-700 dark:text-blue-200 overflow-x-auto whitespace-pre-wrap break-all sm:whitespace-pre sm:break-normal">
                                    <code>{`// Track a purchase event
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
});`}</code>
                                </pre>
                                <CopyButton
                                    text={`pathing.send.purchase({
  product: "Premium Plan",
  price: 99.99,
  currency: "USD"
});

pathing.send.playback({
  content: "Product Demo Video",
  duration: 120,
  progress: 0.75
});`}
                                    className="absolute top-2 right-2 p-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-600 hover:bg-blue-700 text-white"
                                    iconClassName="w-5 h-5"
                                    showText={true}
                                    defaultText="Copy"
                                    successText="Copied!"
                                />
                            </div>
                        </div>

                        <h4 className="text-lg font-medium mt-4 mb-2">
                            Custom Events
                        </h4>
                        <div className="bg-white dark:bg-gray-900 rounded-lg p-4 mb-4 relative">
                            <div className="relative">
                                <pre className="bg-gray-100 dark:bg-gray-800 rounded p-4 text-sm sm:text-base text-blue-700 dark:text-blue-200 overflow-x-auto whitespace-pre-wrap break-all sm:whitespace-pre sm:break-normal">
                                    <code>{`// Track a custom event
pathing.send.raw("signup_completed", {
  method: "email",
  referrer: document.referrer,
  timestamp: Date.now()
});`}</code>
                                </pre>
                                <CopyButton
                                    text={`pathing.send.raw("signup_completed", {
  method: "email",
  referrer: document.referrer,
  timestamp: Date.now()
});`}
                                    className="absolute top-2 right-2 p-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-600 hover:bg-blue-700 text-white"
                                    iconClassName="w-5 h-5"
                                    showText={true}
                                    defaultText="Copy"
                                    successText="Copied!"
                                />
                            </div>
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
                            <div className="relative">
                                <pre className="bg-gray-100 dark:bg-gray-800 rounded p-4 text-sm sm:text-base text-blue-700 dark:text-blue-200 overflow-x-auto whitespace-pre-wrap break-all sm:whitespace-pre sm:break-normal">
                                    <code>{`// Bind a purchase event to a button
const purchaseButton = document.querySelector("#purchase-button");
pathing.link.purchase(purchaseButton, {
  product: "Premium Plan",
  price: 99.99
});`}</code>
                                </pre>
                                <CopyButton
                                    text={`const purchaseButton = document.querySelector("#purchase-button");
pathing.link.purchase(purchaseButton, {
  product: "Premium Plan",
  price: 99.99
});`}
                                    className="absolute top-2 right-2 p-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-600 hover:bg-blue-700 text-white"
                                    iconClassName="w-5 h-5"
                                    showText={true}
                                    defaultText="Copy"
                                    successText="Copied!"
                                />
                            </div>
                        </div>

                        <h4 className="text-lg font-medium mt-4 mb-2">
                            Custom Bindings
                        </h4>
                        <div className="bg-white dark:bg-gray-900 rounded-lg p-4 mb-4 relative">
                            <div className="relative">
                                <pre className="bg-gray-100 dark:bg-gray-800 rounded p-4 text-sm sm:text-base text-blue-700 dark:text-blue-200 overflow-x-auto whitespace-pre-wrap break-all sm:whitespace-pre sm:break-normal">
                                    <code>{`// Bind a custom event to an element
const signupLink = document.querySelector("#signup-link");
pathing.link.raw(signupLink, "signup_click", {
  source: "header",
  page: window.location.pathname
}, { preventDefault: true });`}</code>
                                </pre>
                                <CopyButton
                                    text={`const signupLink = document.querySelector("#signup-link");
pathing.link.raw(signupLink, "signup_click", {
  source: "header",
  page: window.location.pathname
}, { preventDefault: true });`}
                                    className="absolute top-2 right-2 p-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-600 hover:bg-blue-700 text-white"
                                    iconClassName="w-5 h-5"
                                    showText={true}
                                    defaultText="Copy"
                                    successText="Copied!"
                                />
                            </div>
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
                            <div className="relative">
                                <pre className="bg-gray-100 dark:bg-gray-800 rounded p-4 text-sm sm:text-base text-blue-700 dark:text-blue-200 overflow-x-auto whitespace-pre-wrap break-all sm:whitespace-pre sm:break-normal">
                                    <code>{`// Create a parameter with metadata
const productName = new pathing.Parameter(
  "Product Name", // Label displayed in the dashboard
  "product_name", // Consistent key for database/exports
  "Premium Plan"  // Actual value sent with the event
);

// Use it in an event
pathing.send.purchase({
  product: productName,
  price: 99.99
});`}</code>
                                </pre>
                                <CopyButton
                                    text={`const productName = new pathing.Parameter(
  "Product Name", // Label displayed in the dashboard
  "product_name", // Consistent key for database/exports
  "Premium Plan"  // Actual value sent with the event
);

pathing.send.purchase({
  product: productName,
  price: 99.99
});`}
                                    className="absolute top-2 right-2 p-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-600 hover:bg-blue-700 text-white"
                                    iconClassName="w-5 h-5"
                                    showText={true}
                                    defaultText="Copy"
                                    successText="Copied!"
                                />
                            </div>
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
                            <div className="relative">
                                <pre className="bg-gray-100 dark:bg-gray-800 rounded p-4 text-sm sm:text-base text-blue-700 dark:text-blue-200 overflow-x-auto whitespace-pre-wrap break-all sm:whitespace-pre sm:break-normal">
                                    <code>{`declare global {
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
}`}</code>
                                </pre>
                                <CopyButton
                                    text={`declare global {
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
                                    className="absolute top-2 right-2 p-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-600 hover:bg-blue-700 text-white"
                                    iconClassName="w-5 h-5"
                                    showText={true}
                                    defaultText="Copy"
                                    successText="Copied!"
                                />
                            </div>
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
                            <div className="relative">
                                <pre className="bg-gray-100 dark:bg-gray-800 rounded p-4 text-sm sm:text-base text-blue-700 dark:text-blue-200 overflow-x-auto whitespace-pre-wrap break-all sm:whitespace-pre sm:break-normal">
                                    <code>{`<!-- From pathing.co (primary) -->
<script src="https://cdn.pathing.co/pathing.min.js" pathing-api-key="YOUR_API_KEY"></script>

<!-- From unpkg (fallback) -->
<script src="https://unpkg.com/pathingjs@latest/dist/pathing.min.js" pathing-api-key="YOUR_API_KEY"></script>

<!-- From jsDelivr (fallback) -->
<script src="https://cdn.jsdelivr.net/npm/pathingjs@latest/dist/pathing.min.js" pathing-api-key="YOUR_API_KEY"></script>`}</code>
                                </pre>
                                <CopyButton
                                    text={`<!-- From pathing.co (primary) -->
<script src="https://cdn.pathing.co/pathing.min.js" pathing-api-key="YOUR_API_KEY"></script>`}
                                    className="absolute top-2 right-2 p-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-600 hover:bg-blue-700 text-white"
                                    iconClassName="w-5 h-5"
                                    showText={true}
                                    defaultText="Copy"
                                    successText="Copied!"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
