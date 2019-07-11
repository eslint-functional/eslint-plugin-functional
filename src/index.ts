import all from "./configs/all";
import functionalLite from "./configs/functional-lite";
import functional from "./configs/functional";
import immutable from "./configs/immutable";
import { rules } from "./rules";

const config = {
  rules,
  configs: {
    all,
    recommended: immutable,
    functional,
    "functional-lite": functionalLite
  }
};

export default config;
