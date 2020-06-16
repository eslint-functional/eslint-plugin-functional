// Note: This import will be stripped out by rollup.
import * as tsutils from "tsutils";

// Conditionally loaded tsutils but only if it is avaliable.
export default (() => {
  try {
    return require("tsutils") as typeof tsutils;
  } catch (error) {
    return undefined;
  }
})();
