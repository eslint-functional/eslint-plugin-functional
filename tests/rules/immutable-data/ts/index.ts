import array from "./array";
import object from "./object";

export default {
  valid: [...object.valid, ...array.valid],
  invalid: [...object.invalid, ...array.invalid],
};
