import { type Linter } from "@typescript-eslint/utils/ts-eslint";

import currying from "#eslint-plugin-functional/configs/currying";
import noExceptions from "#eslint-plugin-functional/configs/no-exceptions";
import noMutations from "#eslint-plugin-functional/configs/no-mutations";
import noOtherParadigms from "#eslint-plugin-functional/configs/no-other-paradigms";
import noStatements from "#eslint-plugin-functional/configs/no-statements";
import { mergeConfigs } from "#eslint-plugin-functional/utils/merge-configs";

const config: Linter.Config = mergeConfigs(
  currying,
  noMutations,
  noExceptions,
  noOtherParadigms,
  noStatements,
);

export default config;
