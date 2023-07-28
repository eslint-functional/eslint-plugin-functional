import type ts from "typescript";

export default (() => {
  try {
    return require("typescript") as typeof ts;
  } catch {
    return undefined;
  }
})();
