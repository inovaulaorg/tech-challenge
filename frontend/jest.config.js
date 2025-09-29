module.exports = {
  // Test environment for React components
  testEnvironment: 'jsdom',

  // Automatically clear mock calls, instances and results before every test
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage",

  // Setup files after environment is set up
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],

  // Module file extensions
  moduleFileExtensions: [
    "js",
    "jsx",
    "ts",
    "tsx",
    "json",
    "node"
  ],

  // Transform files with ts-jest for TypeScript and JSX
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },

  // Test file patterns
  testMatch: [
    "**/__tests__/**/*.[jt]s?(x)",
    "**/?(*.)+(spec|test).[tj]s?(x)"
  ],

  // Module name mapping for static assets and CSS
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(gif|ttf|eot|svg|png)$": "<rootDir>/src/__mocks__/fileMock.js"
  },

  // Ignore transforming node_modules except for specific packages that need it
  transformIgnorePatterns: [
    "node_modules/(?!(.*\\.mjs$))"
  ],

  // Coverage collection patterns
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/index.tsx",
    "!src/reportWebVitals.ts"
  ],

  // Remove the globals section - this is deprecated in newer versions
  // Configure ts-jest in preset or transform options instead
  preset: 'ts-jest/presets/js-with-ts',
  
  // Add this for better JSX handling
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  
  // Modern Jest configuration for ts-jest
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      useESM: true,
      tsconfig: {
        jsx: 'react-jsx'
      }
    }]
  }
};