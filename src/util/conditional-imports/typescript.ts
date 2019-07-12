// Note: This import will be stripped out by rollup.
import ts from "typescript";

// Conditionally loaded TypeScript but only if it is avaliable.
export default (() => {
  try {
    return require("typescript") as typeof ts;
  } catch (error) {
    return undefined;
  }
})();
