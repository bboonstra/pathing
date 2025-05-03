import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// Serve static files from SDK directory and parent directory
app.use(express.static(__dirname));
app.use("/public", express.static(path.join(__dirname, "../public")));
app.use("/dist", express.static(path.join(__dirname, "dist")));

// Explicitly serve the sandbox's css and js files
app.use("/css", express.static(path.join(__dirname, "sandbox/css")));
app.use("/js", express.static(path.join(__dirname, "sandbox/js")));

// Serve the sandbox test page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "sandbox/index.html"));
});

// Serve specific test cases
app.get("/tests/:testName", (req, res) => {
    const testName = req.params.testName;
    const testFile = path.join(__dirname, `sandbox/tests/${testName}.html`);

    res.sendFile(testFile, (err) => {
        if (err) {
            console.error(`Error serving test file ${testFile}:`, err.message);
            res.status(404).send(`Test file ${testName}.html not found`);
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`PathingJS Sandbox running at http://localhost:${port}`);
    console.log(
        `View test cases at http://localhost:${port}/tests/[test-name]`
    );
});
