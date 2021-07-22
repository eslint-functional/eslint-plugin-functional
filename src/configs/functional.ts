import { all as deepMerge } from "deepmerge";
import type { Linter } from "eslint";

import currying from "./currying";
import noExceptions from "./no-exceptions";
import noMutations from "./no-mutations";
import noObjectOrientation from "./no-object-orientation";
import noStatements from "./no-statements";

const config: Linter.Config = deepMerge([
  currying,
  noMutations,
  noExceptions,
  noObjectOrientation,
  noStatements,
]);

export default config;
