import type { Linter } from "eslint";

const config: Linter.Config = {
  rules: {
    "functional/no-this-expression": "error",
    "functional/no-class": "error",
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      rules: {
        "functional/no-mixed-type": "error",
        "functional/prefer-type-literal": "error",
      },
    },
  ],
};

export default config;
