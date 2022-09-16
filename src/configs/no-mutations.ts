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
        "functional/prefer-immutable-parameter-types": "error",
        "functional/type-declaration-immutability": "error",
      },
    },
  ],
};

export default config;
