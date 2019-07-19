import { all as deepMerge } from "deepmerge";

import functionalLite from "./functional-lite";

const config = deepMerge([
  functionalLite,
  {
    rules: {
      "functional/no-conditional-statement": "error",
      "functional/no-expression-statement": "error",
      "functional/no-try": "error"
    }
  }
]);

export default config;
