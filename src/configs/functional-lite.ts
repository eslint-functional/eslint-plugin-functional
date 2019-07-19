import { all as deepMerge } from "deepmerge";

import immutable from "./immutable";

const config = deepMerge([
  immutable,
  {
    rules: {
      "functional/no-this": "error",
      "functional/no-class": "error",
      "functional/no-loop-statement": "error",
      "functional/no-conditional-statement": [
        "error",
        { allowReturningBranches: true }
      ],
      "functional/no-throw": "error",
      "functional/no-return-void": "error",
      "functional/functional-parameters": "error"
    },
    overrides: [
      {
        files: ["*.ts", "*.tsx"],
        rules: {
          "functional/no-mixed-interface": "error"
        }
      }
    ]
  }
]);

export default config;
