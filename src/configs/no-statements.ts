const config = {
  rules: {
    "functional/no-expression-statement": "error",
    "functional/no-conditional-statement": "error",
    "functional/no-loop-statement": "error"
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      rules: {
        "functional/no-return-void": "error"
      }
    }
  ]
};

export default config;
