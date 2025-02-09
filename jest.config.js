module.exports = {
  collectCoverageFrom: ["src/**/*.ts"],
  coverageDirectory: "<rootDir>/reports/coverage",
  moduleDirectories: ["<rootDir>/node_modules"],
  moduleFileExtensions: ["ts", "js", "json"],
  testEnvironment: "node",
  testPathIgnorePatterns: ["<rootDir>/node_modules/"],
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.ts$",
  transform: {
    "^.+\\.ts$": "ts-jest",
    "^.+\\.txt$": "jest-raw-loader",
  },
  globals: {
    "ts-jest": {
      diagnostics: {
        warnOnly: true,
      },
    },
  },
};
