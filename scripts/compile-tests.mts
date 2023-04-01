import * as tsc from "tsc-prog";

transpileTests();

/**
 * Transpile the tests.
 */
function transpileTests() {
  const program = tsc.createProgramFromConfig({
    basePath: `${process.cwd()}/tests`,
    compilerOptions: {
      sourceMap: true,
    },
  });

  tsc.emit(program, {
    clean: { outDir: true },
  });
}
