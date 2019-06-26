"use strict";

/**
 * Used compiled rules? i.e. test against JS files instead of TS files.
 */
const useCompiled = process.env.USE_COMPLIED !== undefined;

module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\\.ts$": "ts-jest"
  },
  testRegex: useCompiled
    ? "./build/tests/.+\\.test\\.js$"
    : "./tests/.+\\.test\\.ts$",
  collectCoverage: !useCompiled,
  collectCoverageFrom: useCompiled ? ["build/src/**/*.js"] : ["src/**/*.ts"],
  moduleFileExtensions: ["ts", "js", "json", "node"],
  coverageReporters: ["text-summary", "lcov"]
};
