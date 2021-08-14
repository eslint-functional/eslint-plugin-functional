// Note: This import will be stripped out by rollup.
import type * as tsutils from "tsutils";

// Conditionally loaded tsutils but only if it is available.
export default (() => {
  try {
    return require("tsutils") as typeof tsutils;
  } catch {
    return undefined;
  }
})();
