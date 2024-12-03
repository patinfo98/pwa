module.exports = {
  testEnvironment: "node", // Specifies the test environment as Node.js (ideal for backend testing)
  collectCoverage: true, // Enables code coverage reporting
  coverageDirectory: "./coverage", // Defines the directory where coverage reports will be saved
  collectCoverageFrom: [
    "js/**/*.js", // Includes all JavaScript files in the `js/` directory for coverage reporting
  ],
  testMatch: [
    "**/tests/**/*.test.js", // Matches all test files in the `tests/` directory with the `.test.js` extension
  ],
};
