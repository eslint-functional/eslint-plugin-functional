import { all as deepMerge } from "deepmerge";

import recommended from "./external-recommended";

const config = deepMerge([
  recommended,
  {
    rules: {
      "ts-immutable/no-let": "error",
      "ts-immutable/immutable-data": "error"
    },
    overrides: [
      {
        files: ["*.ts", "*.tsx"],
        rules: {
          "ts-immutable/no-method-signature": "warn",
          "ts-immutable/prefer-readonly-types": "error"
        }
      }
    ]
  }
]);

export default config;
