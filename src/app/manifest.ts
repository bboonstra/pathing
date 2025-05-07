import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Pathing Analytics",
        short_name: "Pathing",
        description:
            "Effortless, privacy-first analytics that instantly help you understand user journeys.",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#0a0a0a",
        orientation: "portrait",
        icons: [
            {
                src: "/favicon.ico",
                sizes: "48x48",
                type: "image/x-icon",
            },
            {
                src: "/android-chrome-512x512.png",
                sizes: "512x512",
                type: "image/png",
            },
            {
                src: "/apple-touch-icon.png",
                sizes: "180x180",
                type: "image/png",
                purpose: "maskable",
            },
            {
                src: "/favicon-32x32.png",
                sizes: "32x32",
                type: "image/png",
            },
            {
                src: "/favicon-16x16.png",
                sizes: "16x16",
                type: "image/png",
            },
        ],
    };
}
