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
      },
    },
  ],
};

export default config;
