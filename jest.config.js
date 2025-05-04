module.exports = {
    preset: "ts-jest",
    testEnvironment: "jsdom",
    roots: ["<rootDir>/src"],
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/.next/"],
    transform: {
        "^.+\\.(ts|tsx)$": "babel-jest",
    },
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
        // Mock CSS imports
        "\\.(css|less|scss|sass)$": "identity-obj-proxy",
        // Mock image imports
        "\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/__mocks__/fileMock.js",
    },
    setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
    // Set up a global mock for fetch
    setupFiles: ["<rootDir>/jest.globalSetup.js"],
    testEnvironmentOptions: {
        // Add browser-like globals
        url: "http://localhost/",
    },
};
