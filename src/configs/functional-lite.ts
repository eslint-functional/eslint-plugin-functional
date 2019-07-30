import deepMerge from "deepmerge";

import functional from "./functional";

const config = deepMerge(functional, {
  rules: {
    "functional/no-conditional-statement": "off",
    "functional/no-expression-statement": "off",
    "functional/no-try-statement": "off"
  }
});

export default config;
