import path from "node:path";

import * as typescriptParser from "@typescript-eslint/parser";
import type { ParserOptions } from "@typescript-eslint/parser";
import type { Linter } from "eslint";

export const typescriptConfig = {
  languageOptions: {
    parser: typescriptParser,
    parserOptions: {
      tsconfigRootDir: path.join(import.meta.dirname, "../fixture"),
      projectService: {
        // Ensure we're not using the default project
        maximumDefaultProjectFileMatchCount_THIS_WILL_SLOW_DOWN_LINTING: 0,
      },
    },
  },
} satisfies Linter.Config & {
  languageOptions: { parserOptions: ParserOptions };
};

// Use ESLint's default parser (espree) for JavaScript tests.
// Note: @babel/eslint-parser is not compatible with ESLint 10 yet.
// See: https://github.com/babel/babel/issues/17791
export const esLatestConfig = {
  languageOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
} satisfies Linter.Config;
