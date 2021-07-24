import { all as deepMerge } from "deepmerge";
import type { Linter } from "eslint";

import currying from "~/configs/currying";
import noExceptions from "~/configs/no-exceptions";
import noMutations from "~/configs/no-mutations";
import noObjectOrientation from "~/configs/no-object-orientation";
import noStatements from "~/configs/no-statements";

const config: Linter.Config = deepMerge([
  currying,
  noMutations,
  noExceptions,
  noObjectOrientation,
  noStatements,
]);

export default config;
