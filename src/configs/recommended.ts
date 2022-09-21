import { deepmerge } from "deepmerge-ts";
import type { Linter } from "eslint";

import currying from "~/configs/currying";
import noExceptions from "~/configs/no-exceptions";
import noMutations from "~/configs/no-mutations";
import noObjectOrientation from "~/configs/no-object-orientation";
import noStatements from "~/configs/no-statements";

const config: Linter.Config = deepmerge(
  currying,
  noMutations,
  noExceptions,
  noObjectOrientation,
  noStatements
);

export default config;
