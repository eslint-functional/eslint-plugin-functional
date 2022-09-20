import type { Linter } from "eslint";

const config: Linter.Config = {
  rules: {
    "prefer-const": "error",
    "no-param-reassign": "error",
    "no-var": "error",
  },
};

export default config;
