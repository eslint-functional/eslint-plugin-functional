import { promises as fs } from "node:fs";

import * as JSONC from "jsonc-parser";
import * as tsc from "tsc-prog";

transpileTests();
await Promise.all(
  /* eslint-disable unicorn/prefer-top-level-await -- See https://github.com/sindresorhus/eslint-plugin-unicorn/issues/1919 */ [
    createTestsTsConfig(),
    createTestsHelpersTsConfig(),
  ]
  /* eslint-enable unicorn/prefer-top-level-await */
);

/**
 * Transpile the tests.
 */
function transpileTests() {
  const program = tsc.createProgramFromConfig({
    basePath: `${process.cwd()}/tests`,
    configFilePath: "tsconfig.json",
    compilerOptions: {
      sourceMap: true,
    },
  });

  tsc.emit(program, {
    clean: { outDir: true },
  });
}

/**
 * Create a suitable "build/tests/tsconfig.json" file.
 */
async function createTestsTsConfig() {
  const testsTsConfig = JSONC.parse(
    await fs.readFile("tests/tsconfig.json", { encoding: "utf8" })
  );

  const updatedTestsTsConfig = {
    ...testsTsConfig,
    extends: `../${testsTsConfig.extends}`,
    compilerOptions: {
      ...testsTsConfig.compilerOptions,
      baseUrl: "..",
    },
  };

  return fs.writeFile(
    "build/tests/tsconfig.json",
    JSON.stringify(updatedTestsTsConfig, null, 2),
    { encoding: "utf8" }
  );
}

/**
 * Create a suitable "build/tests/helpers/tsconfig.json" file.
 */
async function createTestsHelpersTsConfig() {
  return fs.copyFile(
    "tests/helpers/test-tsconfig.json",
    "build/tests/helpers/test-tsconfig.json"
  );
}
