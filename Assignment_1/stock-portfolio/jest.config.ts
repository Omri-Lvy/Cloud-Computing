import type { Config } from "jest";

const config: Config = {
    preset: "ts-jest",
    testEnvironment: "node",
    verbose: true,
    testTimeout: 30000,
    moduleFileExtensions: ["ts", "js"],
    transform: {
        "^.+\\.ts$": "ts-jest",
    },
    testMatch: ["**/*.test.ts"],
    globalSetup: "./jest.globalSetup.ts",
    globalTeardown: "./jest.globalTeardown.ts",
};

export default config;
