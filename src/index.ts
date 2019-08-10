import all from "./configs/all";
import currying from "./configs/currying";
import functional from "./configs/functional";
import functionalLite from "./configs/functional-lite";
import noMutations from "./configs/no-mutations";
import noExceptions from "./configs/no-exceptions";
import noObjectOrientation from "./configs/no-object-orientation";
import noStatements from "./configs/no-statements";
import { rules } from "./rules";

const config = {
  rules,
  configs: {
    all,
    recommended: functional,
    lite: functionalLite,
    "no-mutations": noMutations,
    "no-exceptions": noExceptions,
    "no-object-orientation": noObjectOrientation,
    "no-statements": noStatements,
    currying
  }
};

export default config;
