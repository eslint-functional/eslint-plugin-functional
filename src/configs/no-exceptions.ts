import deepMerge from "deepmerge";

import recommended from "./external-recommended";

const config = deepMerge(recommended, {
  rules: {
    "no-throw": "error",
    "no-try": "error"
  }
});

export default config;
