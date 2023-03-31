import type tsApiUtils from "ts-api-utils";

import ts from "~/conditional-imports/typescript";

// Conditionally loaded ts-api-utils but only if TypeScript is available.
export default (() => {
  if (ts !== undefined) {
    return require("ts-api-utils") as typeof tsApiUtils;
  }
  return undefined;
})();
