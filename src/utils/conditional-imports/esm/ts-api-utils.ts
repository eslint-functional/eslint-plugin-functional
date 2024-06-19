import type tsApiUtils from "ts-api-utils";

import ts from "#/conditional-imports/typescript";

export default await ((): Promise<typeof tsApiUtils | undefined> => {
  if (ts !== undefined) {
    return import("ts-api-utils").catch(() => undefined);
  }
  return Promise.resolve(undefined);
})();
