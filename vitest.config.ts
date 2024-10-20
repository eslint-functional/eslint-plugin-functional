import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths()],

  test: {
    include: ["./**/*.test.ts"],
    exclude: ["lib", "node_modules"],
    coverage: {
      all: true,
      include: ["src"],
      exclude: ["lib"],
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
