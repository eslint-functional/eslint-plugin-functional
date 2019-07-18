import { all as deepMerge } from "deepmerge";

import immutable from "./immutable";

const config = deepMerge([
  immutable,
  {
    rules: {
      "ts-immutable/no-this": "error",
      "ts-immutable/no-class": "error",
      "ts-immutable/no-loop-statement": "error",
      "ts-immutable/no-conditional-statement": [
        "error",
        { allowReturningBranches: true }
      ],
      "ts-immutable/no-return-void": "error",
      "ts-immutable/no-throw": "error"
    },
    overrides: [
      {
        files: ["*.ts", "*.tsx"],
        rules: {
          "ts-immutable/no-mixed-interface": "error"
        }
      }
    ]
  }
]);

export default config;
