module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.cjs', '**/__tests__/**/*.test.js'],
  collectCoverageFrom: [
    'routes/**/*.cjs',
    'models/**/*.cjs',
    'middleware/**/*.cjs',
    '!**/node_modules/**',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterEnv: ['./__tests__/setup.cjs'],
  testTimeout: 30000,
  verbose: true,
};
