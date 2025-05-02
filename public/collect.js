window.pathing = {
    publicKey: null,
    verificationError: false,

    init: function () {
        // Get the public key from the script tag's attribute
        const scripts = document.querySelectorAll("script[pathing-api-key]");
        if (scripts.length === 0) {
            console.error(
                "Pathing: No script tag with pathing-api-key attribute found"
            );
            return;
        }

        this.publicKey = scripts[0].getAttribute("pathing-api-key");

        if (!this.publicKey) {
            console.error("Pathing: Public key is required");
            return;
        }

        // Auto-track page view
        this.track("pageview", {
            path: window.location.pathname,
            referrer: document.referrer || null,
            title: document.title,
        });
    },

    track: async function (type, payload) {
        if (!this.publicKey) {
            console.error(
                "Pathing: No public key available for tracking events"
            );
            return { success: false, error: "No public key provided" };
        }

        // Don't attempt to track if we've already encountered a verification error
        if (this.verificationError) {
            console.warn("Pathing: Domain not verified. Tracking disabled.");
            return {
                success: false,
                error: "Domain not verified. Please verify your domain ownership.",
            };
        }

        try {
            const res = await fetch("/api/collect", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Pathing-API-Key": this.publicKey,
                },
                body: JSON.stringify({ type, payload }),
            });

            const data = await res.json();

            // If we get a verification error, set the flag to prevent future attempts
            if (
                !data.success &&
                data.error &&
                data.error.includes("not verified")
            ) {
                this.verificationError = true;
                console.warn("Pathing: " + data.error);
            }

            return data;
        } catch (error) {
            console.error("Pathing: Error tracking event", error);
            return { success: false, error: "Failed to track event" };
        }
    },
};

// Auto-initialize when the script loads
(function () {
    // Wait for DOM to be fully loaded
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", function () {
            window.pathing.init();
        });
    } else {
        window.pathing.init();
    }
})();
