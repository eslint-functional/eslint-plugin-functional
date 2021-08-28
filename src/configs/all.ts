import type { Linter } from "eslint";

const config: Linter.Config = {
  rules: {
    "functional/functional-parameters": "error",
    "functional/immutable-data": "error",
    "functional/no-class": "error",
    "functional/no-conditional-statement": "error",
    "functional/no-expression-statement": "error",
    "functional/no-let": "error",
    "functional/no-loop-statement": "error",
    "functional/no-promise-reject": "error",
    "functional/no-this-expression": "error",
    "functional/no-throw-statement": "error",
    "functional/no-try-statement": "error",
    "functional/prefer-tacit": ["warn", { assumeTypes: { allowFixer: false } }],
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      rules: {
        "functional/no-mixed-type": "error",
        "functional/prefer-readonly-type-declaration": "error",
        "functional/prefer-tacit": ["error", { assumeTypes: false }],
        "functional/no-return-void": "error",
      },
    },
  ],
};

export default config;
