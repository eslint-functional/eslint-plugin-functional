import path from "node:path";

// eslint-disable-next-line ts/ban-ts-comment -- Issue should hopefully go await - don't need compain when it does.
// @ts-ignore - https://github.com/babel/babel/issues/17821
import * as babelParser from "@babel/eslint-parser";
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

export const esLatestConfig = {
  languageOptions: {
    parser: babelParser,
    parserOptions: {
      ecmaVersion: "latest",
      requireConfigFile: false,
      babelOptions: {
        babelrc: false,
        configFile: false,
      },
    },
  },
} satisfies Linter.Config;
