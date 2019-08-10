import deepMerge from "deepmerge";

import recommended from "./external-recommended";

const config = deepMerge(recommended, {
  rules: {
    "functional/no-let": "error",
    "functional/immutable-data": "error"
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      rules: {
        "functional/no-method-signature": "warn",
        "functional/prefer-readonly-type": "error"
      }
    }
  ]
});

export default config;
