import deepMerge from "deepmerge";

import recommended from "./external-recommended";

const config = deepMerge(recommended, {
  rules: {
    "functional/functional-parameters": "error"
  }
});

export default config;
