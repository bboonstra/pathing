/**
 * Pathing SDK Test Utilities
 *
 * A lightweight test framework for the Pathing SDK.
 */

const PathingTest = {
    /**
     * Initialize the test framework
     */
    init() {
        this.results = [];
        this.testContainer = document.getElementById("test-results");
        this.resultsSent = false;

        // Add back button
        const backLink = document.createElement("a");
        backLink.href = "/";
        backLink.textContent = "Back to Test List";
        backLink.style.display = "inline-block";
        backLink.style.marginBottom = "20px";

        const header = document.querySelector("header");
        if (header) {
            header.appendChild(backLink);
        }

        // Listen for messages from the parent window
        window.addEventListener("message", (event) => {
            if (
                event.data === "runTests" &&
                typeof window.runAllTests === "function"
            ) {
                window.runAllTests();
            }
        });

        return this;
    },

    /**
     * Run a suite of tests
     * @param {string} suiteName - The name of the test suite
     * @param {Function} testsFn - Function containing the tests to run
     */
    suite(suiteName, testsFn) {
        console.log(`Running test suite: ${suiteName}`);

        // Create a section for this test suite
        const suiteSection = document.createElement("div");
        suiteSection.className = "test-suite";
        suiteSection.innerHTML = `<h2>${suiteName}</h2>`;

        this.testContainer.appendChild(suiteSection);
        this.currentSuiteEl = suiteSection;
        this.currentSuite = suiteName;

        // Run the tests
        testsFn();
    },

    /**
     * Run an individual test
     * @param {string} testName - The name of the test
     * @param {Function} testFn - The test function
     */
    test(testName, testFn) {
        // Create test element
        const testEl = document.createElement("div");
        testEl.className = "test-case";
        testEl.innerHTML = `
            <h3>${testName}</h3>
            <div class="test-status">Running...</div>
            <div class="test-details"></div>
        `;

        this.currentSuiteEl.appendChild(testEl);
        const statusEl = testEl.querySelector(".test-status");
        const detailsEl = testEl.querySelector(".test-details");

        // Track all assertions
        const assertions = [];

        try {
            // Run the test with a custom assert function
            testFn({
                // Basic assertion
                assert: (condition, message) => {
                    const result = {
                        passed: !!condition,
                        message: message || "Assertion failed",
                    };
                    assertions.push(result);
                    return result.passed;
                },

                // Equality assertion
                assertEqual: (actual, expected, message) => {
                    const passed = actual === expected;
                    const result = {
                        passed,
                        message:
                            message || `Expected ${expected} but got ${actual}`,
                        actual,
                        expected,
                    };
                    assertions.push(result);
                    return passed;
                },

                // Type assertion
                assertType: (value, type, message) => {
                    const actualType = typeof value;
                    const passed = actualType === type;
                    const result = {
                        passed,
                        message:
                            message ||
                            `Expected type ${type} but got ${actualType}`,
                        actual: actualType,
                        expected: type,
                    };
                    assertions.push(result);
                    return passed;
                },

                // Structure assertion
                assertStructure: (obj, structure, message) => {
                    let passed = true;
                    const missing = [];

                    for (const key of structure) {
                        if (!(key in obj)) {
                            passed = false;
                            missing.push(key);
                        }
                    }

                    const result = {
                        passed,
                        message:
                            message ||
                            `Missing expected properties: ${missing.join(
                                ", "
                            )}`,
                        missing,
                    };
                    assertions.push(result);
                    return passed;
                },
            });

            // Calculate test result
            const allPassed = assertions.every((a) => a.passed);
            statusEl.textContent = allPassed ? "PASSED" : "FAILED";
            statusEl.className = `test-status ${
                allPassed ? "passed" : "failed"
            }`;

            // Show assertion details
            assertions.forEach((assertion, i) => {
                const assertEl = document.createElement("div");
                assertEl.className = `assertion ${
                    assertion.passed ? "passed" : "failed"
                }`;
                assertEl.textContent = assertion.passed
                    ? `✓ Assertion ${i + 1} passed`
                    : `✗ Assertion ${i + 1} failed: ${assertion.message}`;
                detailsEl.appendChild(assertEl);
            });

            // If no assertions were made, show a warning
            if (assertions.length === 0) {
                const warningEl = document.createElement("div");
                warningEl.className = "warning";
                warningEl.textContent =
                    "Warning: No assertions were made in this test";
                detailsEl.appendChild(warningEl);
            }

            // Store test result
            this.results.push({
                name: `${this.currentSuite}: ${testName}`,
                passed: allPassed,
                assertions: assertions.length,
                failedAssertions: assertions.filter((a) => !a.passed).length,
            });
        } catch (error) {
            // Handle errors in the test
            statusEl.textContent = "ERROR";
            statusEl.className = "test-status error";

            const errorEl = document.createElement("div");
            errorEl.className = "test-error";
            errorEl.textContent = `Test error: ${error.message}`;
            detailsEl.appendChild(errorEl);

            console.error(`Error in test "${testName}":`, error);

            // Store test result
            this.results.push({
                name: `${this.currentSuite}: ${testName}`,
                passed: false,
                error: error.message,
            });
        }
    },

    /**
     * Send test results to the parent window
     */
    sendResultsToParent() {
        // Only send results once
        if (this.resultsSent) return;

        if (window.parent && window.parent !== window) {
            console.log("Sending test results to parent:", this.results);
            window.parent.postMessage(
                {
                    testResults: this.results,
                },
                "*"
            );
            // Mark results as sent
            this.resultsSent = true;
        }
    },

    /**
     * Wait for a condition to be true
     * @param {Function} conditionFn - Function that returns true when the condition is met
     * @param {number} timeout - Maximum time to wait in ms
     * @returns {Promise} - Resolves when condition is true, rejects on timeout
     */
    waitFor(conditionFn, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();

            const check = () => {
                if (conditionFn()) {
                    resolve();
                } else if (Date.now() - startTime > timeout) {
                    reject(new Error("Timed out waiting for condition"));
                } else {
                    setTimeout(check, 100);
                }
            };

            check();
        });
    },
};

// Export the test utils
window.PathingTest = PathingTest;
