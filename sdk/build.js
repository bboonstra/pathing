import { build } from "esbuild";

// Common options for both builds
const commonOptions = {
    entryPoints: ["src/index.ts"],
    bundle: true,
    minify: true,
    sourcemap: true,
    target: ["es2017"],
};

// Build IIFE version for script tag inclusion
build({
    ...commonOptions,
    outfile: "dist/pathing.min.js",
    format: "iife",
    globalName: "pathing", // makes it accessible as `window.pathing`
}).catch(() => process.exit(1));

// Build ESM version for npm imports
build({
    ...commonOptions,
    outfile: "dist/pathing.esm.js",
    format: "esm",
}).catch(() => process.exit(1));
