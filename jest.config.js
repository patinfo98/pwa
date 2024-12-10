module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
      '^.+\\.jsx?$': 'babel-jest',
    },
    testEnvironment: 'jsdom', // or 'node' depending on your needs
};
