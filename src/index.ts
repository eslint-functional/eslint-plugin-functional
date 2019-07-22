import all from "./configs/all";
import currying from "./configs/currying";
import functional from "./configs/functional";
import functionalLite from "./configs/functional-lite";
import immutable from "./configs/immutable";
import noExceptions from "./configs/no-exceptions";
import noObjectOrientation from "./configs/no-object-orientation";
import noStatements from "./configs/no-statements";
import { rules } from "./rules";

const config = {
  rules,
  configs: {
    all,
    currying,
    immutable,
    lite: functionalLite,
    "no-exceptions": noExceptions,
    "no-object-orientation": noObjectOrientation,
    "no-statements": noStatements,
    recommended: functional
  }
};

export default config;
