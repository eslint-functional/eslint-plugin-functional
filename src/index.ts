import all from "./configs/all.json";
import base from "./configs/base.json";
import eslintRecommended from "./configs/eslint-recommended.json";
import functionalLite from "./configs/functional-lite.json";
import functional from "./configs/functional.json";
import recommended from "./configs/recommended.json";
import { rules } from "./rules";

export default {
  rules,
  configs: {
    all,
    base,
    recommended,
    functional,
    "functional-lite": functionalLite,
    "eslint-recommended": eslintRecommended
  }
};
