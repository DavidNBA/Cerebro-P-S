import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Add any custom config to be passed to Jest
const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  preset: 'ts-jest', // Use ts-jest preset
  moduleNameMapper: {
    // Handle module aliases (this will be automatically configured for you soon)
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'], // Run some code to configure or set up the testing framework before each test
  // transform: {
  //   '^.+\\.(ts|tsx)$': 'ts-jest', // Moved to preset
  // },
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
