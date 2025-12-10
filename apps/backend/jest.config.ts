import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    rootDir: '.',
    moduleFileExtensions: ['js', 'json', 'ts'],
    testRegex: String.raw`.*\.(spec|test)\.ts$`,
    transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
    },
    moduleNameMapper: {
        '^@src/(.*)$': '<rootDir>/src/$1',
        '^@domain/(.*)$': '<rootDir>/src/domain/$1',
        '^@infra/(.*)$': '<rootDir>/src/infrastructure/$1',
        '^@http/(.*)$': '<rootDir>/src/infrastructure/http/$1',
        '^@mocks/(.*)$': '<rootDir>/test/__mocks__/$1',
    },
    collectCoverage: true,
    collectCoverageFrom: ['src/**/*.ts'],
    coverageReporters: ['text', 'lcov'],
    coverageDirectory: 'coverage',
    coverageThreshold: {
        global: {
            statements: 80,
            branches: 80,
            functions: 80,
            lines: 80,
        },
    },
};

export default config;
