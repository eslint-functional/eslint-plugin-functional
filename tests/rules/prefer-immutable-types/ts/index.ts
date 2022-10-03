import parameters from "./parameters";
import returnTypes from "./return-types";
import variables from "./variables";

export default {
  valid: [...parameters.valid, ...returnTypes.valid, ...variables.valid],
  invalid: [
    ...parameters.invalid,
    ...returnTypes.invalid,
    ...variables.invalid,
  ],
};
