
import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    extensionsToTreatAsEsm: ['.ts'],
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    transform: {
        '^.+\\.tsx?$': [
            'ts-jest',
            {
                useESM: true,
            },
        ],
    },
    setupFiles: ['dotenv/config'],
    verbose: true,
    testTimeout: 30000,
    clearMocks: true,
    collectCoverage: true,
    coverageDirectory: 'coverage',
    testMatch: [
        "**/tests/**/*.test.ts"
    ]
};

export default config;