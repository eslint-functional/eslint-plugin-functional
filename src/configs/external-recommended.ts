import type { Linter } from "eslint";

const config: Linter.Config = {
  rules: {
    "prefer-const": "error",
    "no-param-reassign": "error",
    "no-var": "error",
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      rules: {
        "@typescript-eslint/prefer-readonly": "error",
        "@typescript-eslint/prefer-readonly-parameter-types": "warn",
        "@typescript-eslint/switch-exhaustiveness-check": "error",
      },
    },
  ],
};

export default config;
