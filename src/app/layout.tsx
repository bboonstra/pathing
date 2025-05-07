import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Sora } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

const sora = Sora({
    variable: "--font-sora",
    subsets: ["latin"],
    weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
    title: "Pathing",
    description: "See analytics in your user's shoes.",
    metadataBase: new URL("https://www.pathing.cc"),
    alternates: {
        canonical: "/",
    },
    keywords: [
        "analytics",
        "privacy-first",
        "user journeys",
        "web analytics",
        "anonymized",
        "real-time analytics",
        "user tracking",
        "website analytics",
        "privacy focused",
        "website monitoring",
        "user behavior",
        "digital analytics",
    ],
    authors: [{ name: "bboonstra", url: "https://github.com/bboonstra" }],
    creator: "bboonstra",
    publisher: "pathing.cc",
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    manifest: "/manifest.json",
    applicationName: "Pathing Analytics",
    referrer: "origin-when-cross-origin",
    category: "web analytics",
    openGraph: {
        type: "website",
        locale: "en",
        url: "https://www.pathing.cc",
        title: "Pathing - See analytics in your user's shoes",
        description:
            "Effortless, privacy-first analytics that instantly help you understand user journeys—no bloat, no popups, just clarity.",
        siteName: "Pathing",
        images: [
            {
                url: "/pathing.png",
                width: 72,
                height: 72,
                alt: "Pathing Logo",
            },
        ],
    },
    twitter: {
        card: "summary",
        title: "Pathing - See analytics in your user's shoes",
        description:
            "Effortless, privacy-first analytics that instantly help you understand user journeys—no bloat, no popups, just clarity.",
        images: ["/pathing.png"],
        creator: "@bboonstra",
        site: "@bboonstra",
    },
    appleWebApp: {
        capable: true,
        title: "Pathing Analytics",
        statusBarStyle: "default",
    },
    formatDetection: {
        telephone: false,
        date: false,
        address: false,
        email: false,
    },
    icons: {
        icon: [
            { url: "/favicon.ico", sizes: "any" },
            { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
            { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        ],
        apple: [
            {
                url: "/apple-touch-icon.png",
                sizes: "180x180",
                type: "image/png",
            },
        ],
        other: [
            {
                url: "/android-chrome-192x192.png",
                sizes: "192x192",
                type: "image/png",
            },
            {
                url: "/android-chrome-512x512.png",
                sizes: "512x512",
                type: "image/png",
            },
        ],
    },
};

export const viewport = {
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "white" },
        { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
    ],
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    colorScheme: "dark light",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <style>{`
                    html, body {
                        overscroll-behavior: none;
                    }
                `}</style>
            </head>
            <body
                className={`${geistSans.variable} ${geistMono.variable} ${sora.variable} antialiased`}
            >
                {children}
                <SpeedInsights />
                <Analytics />
                <Script
                    src="/pathing.js"
                    pathing-api-key={process.env.NEXT_PUBLIC_PATHING_API_KEY}
                    strategy="lazyOnload"
                />
            </body>
        </html>
    );
}
