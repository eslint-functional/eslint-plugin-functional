// @ts-check

/**
 * Get the intended boolean value from the given string.
 */
function getBoolean(value) {
  if (value === undefined) {
    return false;
  }
  const asNumber = Number(value);
  return Number.isNaN(asNumber)
    ? Boolean(String(value).toLowerCase().replace("false", ""))
    : Boolean(asNumber);
}

const useCompiledTest = getBoolean(process.env.USE_COMPILED_TEST);
/**
 * Get the config.
 */
function getConfig() {
  if (useCompiledTest) {
    return {
      testEnvironment: "node",
      testRegex: "build/tests/.+\\.test\\.js$",
      roots: ["<rootDir>/build"],
      modulePaths: ["<rootDir>/build"],
      moduleNameMapper: {
        "~/common/(.*)": "src/common/$1.js",
        "~/conditional-imports/(.*)": "src/util/conditional-imports/$1.js",
        "~/configs/(.*)": "src/configs/$1.js",
        "~/rules/(.*)": "src/rules/$1.js",
        "~/rules": "src/rules/index.js",
        "~/utils/(.*)": "src/util/$1.js",
        "~/tests/(.*)": "tests/$1.js",
        "~": "src/index.js",
      },
    };
  }

  const fs = require("fs");
  const JSONC = require("jsonc-parser");
  const { pathsToModuleNameMapper } = require("ts-jest/utils");

  const {
    compilerOptions: { paths: tsconfigPaths },
  } = JSONC.parse(fs.readFileSync("./tsconfig.json", { encoding: "utf-8" }));

  return {
    testEnvironment: "node",
    transform: {
      "^.+\\.ts$": "ts-jest",
    },
    testRegex: "tests/.+\\.test\\.ts$",
    collectCoverage: true,
    collectCoverageFrom: ["src/**/*.ts"],
    moduleFileExtensions: ["ts", "js", "json", "node"],
    coverageReporters: ["text-summary", "lcov"],
    globals: {
      "ts-jest": {
        tsconfig: "tests/tsconfig.json",
      },
    },
    roots: ["<rootDir>"],
    modulePaths: ["<rootDir>"],
    moduleNameMapper: pathsToModuleNameMapper(tsconfigPaths),
  };
}

module.exports = getConfig();
