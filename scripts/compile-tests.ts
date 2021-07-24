import { promises as fs } from "fs";
import * as JSONC from "jsonc-parser";
import * as tsc from "tsc-prog";

/**
 * The script.
 */
async function run() {
  transpileTests();
  await Promise.all([createTestsTsConfig(), createTestsHelpersTsConfig()]);
}

/**
 * Transpile the tests.
 */
function transpileTests() {
  const program = tsc.createProgramFromConfig({
    basePath: `${process.cwd()}/tests`,
    configFilePath: "tsconfig.json",
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
    await fs.readFile("tests/tsconfig.json", { encoding: "utf-8" })
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
    { encoding: "utf-8" }
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

// Run the script.
run().catch((error) => void console.error(error));
