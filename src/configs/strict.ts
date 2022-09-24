import { deepmerge } from "deepmerge-ts";
import type { Linter } from "eslint";

import currying from "~/configs/currying";
import noExceptions from "~/configs/no-exceptions";
import noMutations from "~/configs/no-mutations";
import noStatements from "~/configs/no-statements";
import noOtherParadigms from "~/src/configs/no-other-paradigms";

const config: Linter.Config = deepmerge(
  currying,
  noMutations,
  noExceptions,
  noOtherParadigms,
  noStatements
);

export default config;
