"use strict";

module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\\.ts$": "ts-jest"
  },
  testRegex: "./tests/.+\\.test\\.ts$",
  collectCoverage: false,
  collectCoverageFrom: ["src/**/*.{js,ts}"],
  moduleFileExtensions: ["ts", "js", "json", "node"],
  coverageReporters: ["text-summary", "lcov"]
};
