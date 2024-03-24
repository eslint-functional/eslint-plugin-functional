import type tsApiUtils from "ts-api-utils";

import ts from "#eslint-plugin-functional/conditional-imports/typescript";

export default (() => {
  if (ts !== undefined) {
    return require("ts-api-utils") as typeof tsApiUtils;
  }
  return undefined;
})();
