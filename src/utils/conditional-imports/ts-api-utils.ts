import { createRequire } from "node:module";

import type tsApiUtils from "ts-api-utils";

import typescript from "#/conditional-imports/typescript";

const require = createRequire(import.meta.url);

export default (typescript === undefined
  ? undefined
  : require("ts-api-utils")) as typeof tsApiUtils | undefined;

// export default (await (() => {
//   if (ts !== undefined) {
//     return import("ts-api-utils").catch(() => undefined);
//   }
//   return Promise.resolve(undefined);
// })()) as typeof tsApiUtils | undefined;
