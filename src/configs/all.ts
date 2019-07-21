const config = {
  rules: {
    "functional/immutable-data": "error",
    "functional/no-class": "error",
    "functional/no-conditional-statement": "error",
    "functional/no-expression-statement": "error",
    "functional/no-let": "error",
    "functional/no-loop-statement": "error",
    "functional/no-reject": "error",
    "functional/no-this": "error",
    "functional/no-throw": "error",
    "functional/no-try": "error"
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      rules: {
        "functional/no-method-signature": "error",
        "functional/no-mixed-interface": "error",
        "functional/prefer-readonly-types": "error",
        "functional/prefer-type": "error"
      }
    }
  ]
};

export default config;
