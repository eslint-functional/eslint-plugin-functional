// Note: This import will be stripped out by rollup.
import type ts from "typescript";

// Conditionally loaded TypeScript but only if it is avaliable.
export default (() => {
  try {
    return require("typescript") as typeof ts;
  } catch {
    return undefined;
  }
})();
