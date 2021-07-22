import deepMerge from "deepmerge";
import type { Linter } from "eslint";

import functional from "./functional";

const config: Linter.Config = deepMerge(functional, {
  rules: {
    "functional/no-conditional-statement": "off",
    "functional/no-expression-statement": "off",
    "functional/no-try-statement": "off",
    "functional/functional-parameters": [
      "error",
      {
        enforceParameterCount: false,
      },
    ],
  },
});

export default config;
