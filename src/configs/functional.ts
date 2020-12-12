import { all as deepMerge } from "deepmerge";
import { Linter } from "eslint";

import currying from "./currying";
import noMutations from "./no-mutations";
import noExceptions from "./no-exceptions";
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
