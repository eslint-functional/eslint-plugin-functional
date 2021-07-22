import type { Linter } from "eslint";

const config: Linter.Config = {
  rules: {
    "functional/prefer-tacit": ["warn", { assumeTypes: { allowFixer: false } }],
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      rules: {
        "functional/prefer-tacit": ["error", { assumeTypes: false }],
      },
    },
  ],
};

export default config;
