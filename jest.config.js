module.exports = {
  testEnvironment: "node", // Ideal pentru backend
  collectCoverage: true, // Activează raportarea coverage-ului
  coverageDirectory: "./coverage", // Unde se salvează rapoartele coverage
  collectCoverageFrom: [
    "*.js", // Include toate fișierele `.js` din rădăcina proiectului
    "!*.test.js", // Exclude testele
    "!jest.config.js", // Exclude fișierul de configurare
  ],
  testMatch: [
    "**/tests/**/*.test.js", // Include toate testele din directorul `tests/`
  ],
};
