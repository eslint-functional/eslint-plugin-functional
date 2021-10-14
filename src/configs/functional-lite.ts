import { deepmerge } from "deepmerge-ts";
import type { Linter } from "eslint";

import functional from "./functional";

const overrides: Linter.Config = {
  rules: {
    "functional/immutable-data": ["error", { ignoreClass: "fieldsOnly" }],
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
};

const config: Linter.Config = deepmerge(functional, overrides);

export default config;
