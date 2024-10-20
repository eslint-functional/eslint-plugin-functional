import path from "node:path";

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
    parser: babelParser as NonNullable<Linter.Config["languageOptions"]>["parser"],
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
