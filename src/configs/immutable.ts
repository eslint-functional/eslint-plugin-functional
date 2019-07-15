import { all as deepMerge } from "deepmerge";

import recommended from "./external-recommended";

const config = deepMerge([
  recommended,
  {
    rules: {
      "ts-immutable/no-let": "error",
      "ts-immutable/immutable-data": "error",
      "ts-immutable/no-delete": "error"
    },
    overrides: [
      {
        files: ["*.ts", "*.tsx"],
        rules: {
          "ts-immutable/no-method-signature": "warn",
          "ts-immutable/readonly-array": "error",
          "ts-immutable/readonly-keyword": "error"
        }
      }
    ]
  }
]);

export default config;
