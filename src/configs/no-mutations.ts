import type { Linter } from "eslint";

const config: Linter.Config = {
  rules: {
    "functional/no-let": "error",
    "functional/immutable-data": "error",
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      rules: {
        "functional/no-method-signature": "warn",
        "functional/prefer-readonly-type-declaration": "error",
      },
    },
  ],
};

export default config;
