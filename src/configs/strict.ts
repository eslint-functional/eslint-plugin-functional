import type { Linter } from "eslint";

import currying from "~/configs/currying";
import noExceptions from "~/configs/no-exceptions";
import noMutations from "~/configs/no-mutations";
import noOtherParadigms from "~/configs/no-other-paradigms";
import noStatements from "~/configs/no-statements";
import { mergeConfigs } from "~/utils/merge-configs";

const config: Linter.Config = mergeConfigs(
  currying,
  noMutations,
  noExceptions,
  noOtherParadigms,
  noStatements
);

export default config;
