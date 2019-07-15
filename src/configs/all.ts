const config = {
  rules: {
    "ts-immutable/no-array-mutation": "error",
    "ts-immutable/no-class": "error",
    "ts-immutable/no-expression-statement": "error",
    "ts-immutable/no-if-statement": "error",
    "ts-immutable/no-let": "error",
    "ts-immutable/no-loop-statement": "error",
    "ts-immutable/no-object-mutation": "error",
    "ts-immutable/no-reject": "error",
    "ts-immutable/no-this": "error",
    "ts-immutable/no-throw": "error",
    "ts-immutable/no-try": "error"
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      rules: {
        "ts-immutable/no-method-signature": "error",
        "ts-immutable/no-mixed-interface": "error",
        "ts-immutable/readonly-array": "error",
        "ts-immutable/readonly-keyword": "error"
      }
    }
  ]
};

export default config;
