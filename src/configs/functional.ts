import { deepmerge } from "deepmerge-ts";
import type { Linter } from "eslint";

import currying from "~/configs/currying";
import noExceptions from "~/configs/no-exceptions";
import noMutations from "~/configs/no-mutations";
import noObjectOrientation from "~/configs/no-object-orientation";
import noStatements from "~/configs/no-statements";
import stylistic from "~/configs/stylistic";

const overrides: Linter.Config = {
  rules: {
    "functional/prefer-tacit": "off",
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      rules: {
        "functional/prefer-tacit": "off",
      },
    },
  ],
};

const config: Linter.Config = deepmerge(
  currying,
  noMutations,
  noExceptions,
  noObjectOrientation,
  noStatements,
  stylistic,
  overrides
);

export default config;
