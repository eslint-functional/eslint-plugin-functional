import type { Linter } from "eslint";

const config: Linter.Config = {
  rules: {
    "functional/functional-parameters": "error",
  },
};

export default config;
