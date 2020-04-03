module.exports = {
  globals: {
    'ts-jest': {
      diagnostics: false
    }
  },
  preset: 'ts-jest',
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  testEnvironment: 'node',
  // "testPathIgnorePatterns": [
  //   "/node_modules/",
  //   "/__utils"
  // ],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testMatch: ["**/*.spec.ts", "**/units/**/*.ts"],
  // "setupTestFrameworkScriptFile": "<rootDir>/setupTests.js"
};