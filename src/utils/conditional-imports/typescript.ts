import { createRequire } from "node:module";

import type typescript from "typescript";

const require = createRequire(import.meta.url);

export default (() => {
  try {
    return require("typescript");
  } catch {
    return undefined;
  }
})() as typeof typescript | undefined;

// export default (await import("typescript")
//   .then((r) => r.default)
//   .catch(() => undefined)) as typeof typescript | undefined;
