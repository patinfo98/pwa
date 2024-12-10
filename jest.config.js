module.exports = {
  testEnvironment: "node", // Ideal for backend
  collectCoverage: true, // Activate coverage report
  coverageDirectory: "./coverage", // reports location
  collectCoverageFrom: [
    "*.js", // Include all `.js` file from project root
    "!*.test.js", // Exclude tests from coverage
    "!jest.config.js", // Exclude configuration file
  ],
  testMatch: [
    "**/tests/**/*.test.js", // Include all tests from directory `tests/`
  ],
};
