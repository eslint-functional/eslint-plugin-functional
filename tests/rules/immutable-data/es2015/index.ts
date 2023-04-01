import array from "./array";
import object from "./object";

export default {
  valid: [...array.valid, ...object.valid],
  invalid: [...array.invalid, ...object.invalid],
};
