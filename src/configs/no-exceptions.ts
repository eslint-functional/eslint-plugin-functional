import deepMerge from "deepmerge";

import recommended from "./external-recommended";

const config = deepMerge(recommended, {
  rules: {
    "functional/no-throw-statement": "error",
    "functional/no-try": "error"
  }
});

export default config;
