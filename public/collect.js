window.pathing = {
    track: async function (type, payload) {
        const res = await fetch("/api/collect", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type, payload }),
        });
        return res.json(); // <-- Add this line
    },
};
