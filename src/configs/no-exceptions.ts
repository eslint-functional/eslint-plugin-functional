import type { Linter } from "eslint";

const config: Linter.Config = {
  rules: {
    "functional/no-throw-statement": "error",
    "functional/no-try-statement": "error",
  },
};

export default config;
