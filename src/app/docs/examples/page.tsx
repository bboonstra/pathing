"use client";

import { useState } from "react";
import { ClipboardIcon, CheckCircleIcon } from "@heroicons/react/24/solid";

export default function ExamplesPage() {
    const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

    const copyToClipboard = (text: string, snippetId: string) => {
        navigator.clipboard.writeText(text);
        setCopiedSnippet(snippetId);
        setTimeout(() => setCopiedSnippet(null), 2000);
    };

    return (
        <>
            <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-600 via-purple-600 to-blue-400 bg-clip-text text-transparent">
                Code Examples
            </h1>

            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Basic Usage</h2>

                <div className="space-y-8">
                    <div>
                        <h3 className="text-xl font-semibold mb-3">
                            Track a Purchase
                        </h3>
                        <p className="mb-4 text-gray-700 dark:text-gray-300">
                            Track a basic purchase event when a user completes a
                            transaction.
                        </p>

                        <div className="bg-white dark:bg-gray-900 rounded-lg p-4 mb-4 relative">
                            <pre className="overflow-x-auto p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                <code className="text-sm text-blue-700 dark:text-blue-300">
                                    {`// Track a purchase with the built-in purchase event
document.getElementById('checkout-button').addEventListener('click', async () => {
  await pathing.send.purchase({
    product: "Pro Subscription",
    price: 99.99,
    currency: "USD",
    quantity: 1
  });
  
  // Continue with checkout process
  completeCheckout();
});`}
                                </code>
                            </pre>
                            <button
                                className="absolute top-4 right-4 p-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                                onClick={() =>
                                    copyToClipboard(
                                        `document.getElementById('checkout-button').addEventListener('click', async () => {
  await pathing.send.purchase({
    product: "Pro Subscription",
    price: 99.99,
    currency: "USD",
    quantity: 1
  });
  
  // Continue with checkout process
  completeCheckout();
});`,
                                        "purchase-example"
                                    )
                                }
                                aria-label="Copy code"
                            >
                                {copiedSnippet === "purchase-example" ? (
                                    <CheckCircleIcon className="h-5 w-5" />
                                ) : (
                                    <ClipboardIcon className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold mb-3">
                            Track Form Submissions
                        </h3>
                        <p className="mb-4 text-gray-700 dark:text-gray-300">
                            Track when users submit a form on your website.
                        </p>

                        <div className="bg-white dark:bg-gray-900 rounded-lg p-4 mb-4 relative">
                            <pre className="overflow-x-auto p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                <code className="text-sm text-blue-700 dark:text-blue-300">
                                    {`// Track form submissions
document.getElementById('contact-form').addEventListener('submit', (event) => {
  // Prevent default form submission
  event.preventDefault();
  
  // Get form data
  const form = event.target;
  const formData = new FormData(form);
  const name = formData.get('name');
  const email = formData.get('email');
  
  // Track the event
  pathing.send.raw('form_submit', {
    form_id: form.id,
    form_name: 'Contact Form',
    user_email_domain: email ? email.toString().split('@')[1] : null,
    has_name: !!name
  }).then(() => {
    // Submit the form after tracking
    form.submit();
  });
});`}
                                </code>
                            </pre>
                            <button
                                className="absolute top-4 right-4 p-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                                onClick={() =>
                                    copyToClipboard(
                                        `document.getElementById('contact-form').addEventListener('submit', (event) => {
  // Prevent default form submission
  event.preventDefault();
  
  // Get form data
  const form = event.target;
  const formData = new FormData(form);
  const name = formData.get('name');
  const email = formData.get('email');
  
  // Track the event
  pathing.send.raw('form_submit', {
    form_id: form.id,
    form_name: 'Contact Form',
    user_email_domain: email ? email.toString().split('@')[1] : null,
    has_name: !!name
  }).then(() => {
    // Submit the form after tracking
    form.submit();
  });
});`,
                                        "form-example"
                                    )
                                }
                                aria-label="Copy code"
                            >
                                {copiedSnippet === "form-example" ? (
                                    <CheckCircleIcon className="h-5 w-5" />
                                ) : (
                                    <ClipboardIcon className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold mb-3">
                            Track Video Playback
                        </h3>
                        <p className="mb-4 text-gray-700 dark:text-gray-300">
                            Monitor how users interact with video content.
                        </p>

                        <div className="bg-white dark:bg-gray-900 rounded-lg p-4 mb-4 relative">
                            <pre className="overflow-x-auto p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                <code className="text-sm text-blue-700 dark:text-blue-300">
                                    {`// Track video playback
const video = document.getElementById('product-demo');

// Track play events
video.addEventListener('play', () => {
  pathing.send.playback({
    content: 'Product Demo Video',
    duration: video.duration,
    progress: video.currentTime / video.duration,
    action: 'play'
  });
});

// Track pause events
video.addEventListener('pause', () => {
  pathing.send.playback({
    content: 'Product Demo Video',
    duration: video.duration,
    progress: video.currentTime / video.duration,
    action: 'pause'
  });
});

// Track completion
video.addEventListener('ended', () => {
  pathing.send.playback({
    content: 'Product Demo Video',
    duration: video.duration,
    progress: 1.0,
    action: 'complete'
  });
});`}
                                </code>
                            </pre>
                            <button
                                className="absolute top-4 right-4 p-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                                onClick={() =>
                                    copyToClipboard(
                                        `const video = document.getElementById('product-demo');

// Track play events
video.addEventListener('play', () => {
  pathing.send.playback({
    content: 'Product Demo Video',
    duration: video.duration,
    progress: video.currentTime / video.duration,
    action: 'play'
  });
});

// Track pause events
video.addEventListener('pause', () => {
  pathing.send.playback({
    content: 'Product Demo Video',
    duration: video.duration,
    progress: video.currentTime / video.duration,
    action: 'pause'
  });
});

// Track completion
video.addEventListener('ended', () => {
  pathing.send.playback({
    content: 'Product Demo Video',
    duration: video.duration,
    progress: 1.0,
    action: 'complete'
  });
});`,
                                        "video-example"
                                    )
                                }
                                aria-label="Copy code"
                            >
                                {copiedSnippet === "video-example" ? (
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
                <h2 className="text-2xl font-bold mb-6">Advanced Patterns</h2>

                <div className="space-y-8">
                    <div>
                        <h3 className="text-xl font-semibold mb-3">
                            Declarative Tracking with HTML Attributes
                        </h3>
                        <p className="mb-4 text-gray-700 dark:text-gray-300">
                            Add tracking to elements using data attributes
                            without writing JavaScript.
                        </p>

                        <div className="bg-white dark:bg-gray-900 rounded-lg p-4 mb-4 relative">
                            <pre className="overflow-x-auto p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                <code className="text-sm text-blue-700 dark:text-blue-300">
                                    {`<!-- HTML -->
<button 
  id="signup-button"
  data-pathing-event="signup_click"
  data-pathing-source="header"
  data-pathing-plan="free"
>
  Sign Up Now
</button>

<!-- JavaScript to initialize tracking -->
<script>
  // Find all elements with data-pathing-event attributes
  document.querySelectorAll('[data-pathing-event]').forEach(el => {
    el.addEventListener('click', function() {
      // Get all data-pathing-* attributes
      const event = this.getAttribute('data-pathing-event');
      const payload = {};
      
      // Extract all data-pathing-* attributes (except event)
      for (const attr of this.attributes) {
        if (attr.name.startsWith('data-pathing-') && attr.name !== 'data-pathing-event') {
          const key = attr.name.replace('data-pathing-', '');
          payload[key] = attr.value;
        }
      }
      
      // Send the event
      pathing.send.raw(event, payload);
    });
  });
</script>`}
                                </code>
                            </pre>
                            <button
                                className="absolute top-4 right-4 p-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                                onClick={() =>
                                    copyToClipboard(
                                        `<!-- HTML -->
<button 
  id="signup-button"
  data-pathing-event="signup_click"
  data-pathing-source="header"
  data-pathing-plan="free"
>
  Sign Up Now
</button>

<!-- JavaScript to initialize tracking -->
<script>
  // Find all elements with data-pathing-event attributes
  document.querySelectorAll('[data-pathing-event]').forEach(el => {
    el.addEventListener('click', function() {
      // Get all data-pathing-* attributes
      const event = this.getAttribute('data-pathing-event');
      const payload = {};
      
      // Extract all data-pathing-* attributes (except event)
      for (const attr of this.attributes) {
        if (attr.name.startsWith('data-pathing-') && attr.name !== 'data-pathing-event') {
          const key = attr.name.replace('data-pathing-', '');
          payload[key] = attr.value;
        }
      }
      
      // Send the event
      pathing.send.raw(event, payload);
    });
  });
</script>`,
                                        "declarative-example"
                                    )
                                }
                                aria-label="Copy code"
                            >
                                {copiedSnippet === "declarative-example" ? (
                                    <CheckCircleIcon className="h-5 w-5" />
                                ) : (
                                    <ClipboardIcon className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold mb-3">
                            User Identification
                        </h3>
                        <p className="mb-4 text-gray-700 dark:text-gray-300">
                            Associate events with user identifiers for cohort
                            analysis.
                        </p>

                        <div className="bg-white dark:bg-gray-900 rounded-lg p-4 mb-4 relative">
                            <pre className="overflow-x-auto p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                <code className="text-sm text-blue-700 dark:text-blue-300">
                                    {`// Set user identity after login
function onUserLogin(user) {
  // Store user ID in local storage for persistence
  localStorage.setItem('pathing_user_id', user.id);
  
  // Track the login event with user properties
  pathing.send.raw('user_login', {
    user_id: user.id,
    user_email_domain: user.email.split('@')[1],
    account_type: user.accountType,
    login_method: 'email' // or 'google', 'github', etc.
  });
}

// Add user ID to all future events
pathing.addMiddleware(event => {
  const userId = localStorage.getItem('pathing_user_id');
  if (userId) {
    // Add to the event payload
    event.payload.user_id = userId;
  }
  return event;
});`}
                                </code>
                            </pre>
                            <button
                                className="absolute top-4 right-4 p-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                                onClick={() =>
                                    copyToClipboard(
                                        `// Set user identity after login
function onUserLogin(user) {
  // Store user ID in local storage for persistence
  localStorage.setItem('pathing_user_id', user.id);
  
  // Track the login event with user properties
  pathing.send.raw('user_login', {
    user_id: user.id,
    user_email_domain: user.email.split('@')[1],
    account_type: user.accountType,
    login_method: 'email' // or 'google', 'github', etc.
  });
}

// Add user ID to all future events
pathing.addMiddleware(event => {
  const userId = localStorage.getItem('pathing_user_id');
  if (userId) {
    // Add to the event payload
    event.payload.user_id = userId;
  }
  return event;
});`,
                                        "user-id-example"
                                    )
                                }
                                aria-label="Copy code"
                            >
                                {copiedSnippet === "user-id-example" ? (
                                    <CheckCircleIcon className="h-5 w-5" />
                                ) : (
                                    <ClipboardIcon className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold mb-3">
                            SPA Router Integration
                        </h3>
                        <p className="mb-4 text-gray-700 dark:text-gray-300">
                            Track page views in single-page applications.
                        </p>

                        <div className="bg-white dark:bg-gray-900 rounded-lg p-4 mb-4 relative">
                            <pre className="overflow-x-auto p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                <code className="text-sm text-blue-700 dark:text-blue-300">
                                    {`// Vue Router example
import { createRouter } from 'vue-router';

const router = createRouter({
  // router config
});

// Track page views
router.afterEach((to) => {
  pathing.send.raw('pageview', {
    path: to.path,
    title: document.title,
    isVirtualPageview: true,
    query_params: to.query
  });
});

// React Router example with hooks
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function PathroutingTracker() {
  const location = useLocation();
  
  useEffect(() => {
    pathing.send.raw('pageview', {
      path: location.pathname,
      title: document.title,
      isVirtualPageview: true,
      query_params: Object.fromEntries(new URLSearchParams(location.search))
    });
  }, [location]);
  
  return null;
}`}
                                </code>
                            </pre>
                            <button
                                className="absolute top-4 right-4 p-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                                onClick={() =>
                                    copyToClipboard(
                                        `// Vue Router example
import { createRouter } from 'vue-router';

const router = createRouter({
  // router config
});

// Track page views
router.afterEach((to) => {
  pathing.send.raw('pageview', {
    path: to.path,
    title: document.title,
    isVirtualPageview: true,
    query_params: to.query
  });
});

// React Router example with hooks
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function PathroutingTracker() {
  const location = useLocation();
  
  useEffect(() => {
    pathing.send.raw('pageview', {
      path: location.pathname,
      title: document.title,
      isVirtualPageview: true,
      query_params: Object.fromEntries(new URLSearchParams(location.search))
    });
  }, [location]);
  
  return null;
}`,
                                        "spa-example"
                                    )
                                }
                                aria-label="Copy code"
                            >
                                {copiedSnippet === "spa-example" ? (
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
                <h2 className="text-2xl font-bold mb-6">Best Practices</h2>

                <div className="space-y-6">
                    <div>
                        <h3 className="text-xl font-semibold mb-3">
                            Data Hygiene
                        </h3>
                        <p className="mb-4 text-gray-700 dark:text-gray-300">
                            Follow these principles for clean, useful analytics
                            data:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                            <li>
                                Use consistent naming conventions for events
                            </li>
                            <li>
                                Use snake_case for event types and property keys
                            </li>
                            <li>
                                Document your event schema for your team&apos;s
                                reference
                            </li>
                            <li>
                                Include timestamp data for events that might be
                                sent later
                            </li>
                            <li>
                                Sanitize personal information (use domains
                                instead of full emails)
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold mb-3">
                            Create a Tracking Plan
                        </h3>
                        <p className="mb-4 text-gray-700 dark:text-gray-300">
                            Document your tracking strategy to maintain
                            consistency across your team.
                        </p>
                        <p className="mb-4 text-gray-700 dark:text-gray-300">
                            A good tracking plan includes:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                            <li>Event names and their triggers</li>
                            <li>Expected properties for each event</li>
                            <li>Example values for each property</li>
                            <li>Business questions each event helps answer</li>
                        </ul>
                    </div>
                </div>
            </section>
        </>
    );
}
