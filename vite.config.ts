import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

/**
 * Get the intended boolean value from the given string.
 */
function getBoolean(value: string | undefined) {
  if (value === undefined) {
    return false;
  }
  const asNumber = Number(value);
  return Number.isNaN(asNumber)
    ? Boolean(String(value).toLowerCase().replace("false", ""))
    : Boolean(asNumber);
}

const useCompiledTests = getBoolean(process.env["USE_COMPILED_TESTS"]);

const testFilePattern = `${
  useCompiledTests ? "tests-compiled" : "."
}/**/*.test.${useCompiledTests ? "js" : "ts"}`;

export default defineConfig({
  plugins: [tsconfigPaths()],

  test: {
    include: [testFilePattern],
    coverage: {
      provider: "c8",
      include: ["src/**/*.ts"],
      // @ts-expect-error -- Untyped option.
      excludeAfterRemap: true,
      clean: true,
      reporter: ["lcov", "text"],
      watermarks: {
        lines: [80, 95],
        functions: [80, 95],
        branches: [80, 95],
        statements: [80, 95],
      },
    },
  },
});
