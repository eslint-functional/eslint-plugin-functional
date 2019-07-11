const config = {
  rules: {
    "prefer-const": "error",
    "no-param-reassign": "error",
    "no-var": "error"
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      rules: {
        "@typescript-eslint/explicit-function-return-type": "warn"
      }
    }
  ]
};

export default config;
