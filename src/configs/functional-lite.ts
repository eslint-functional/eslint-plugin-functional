import deepMerge from "deepmerge";

import functional from "./functional";

import { Config } from "../util/misc";

const config: Config = deepMerge<Config>(functional, {
  rules: {
    "functional/no-conditional-statement": "off",
    "functional/no-expression-statement": "off",
    "functional/no-try-statement": "off",
    "functional/functional-parameters": [
      "error",
      {
        enforceParameterCount: false,
      },
    ],
  },
});

export default config;
