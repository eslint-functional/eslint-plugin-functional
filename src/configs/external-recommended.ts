import { Config } from "../util/misc";

const config: Config = {
  rules: {
    "prefer-const": "error",
    "no-param-reassign": "error",
    "no-var": "error"
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      rules: {
        "@typescript-eslint/explicit-function-return-type": [
          "error",
          {
            allowExpressions: true,
            allowTypedFunctionExpressions: true,
            allowHigherOrderFunctions: true
          }
        ]
      }
    }
  ]
};

export default config;
