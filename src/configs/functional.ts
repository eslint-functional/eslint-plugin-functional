import { all as deepMerge } from "deepmerge";

import functionalLite from "./functional-lite";

const config = deepMerge([
  functionalLite,
  {
    rules: {
      "ts-immutable/no-expression-statement": "error",
      "ts-immutable/no-if-statement": "error",
      "ts-immutable/no-try": "error"
    }
  }
]);

export default config;
