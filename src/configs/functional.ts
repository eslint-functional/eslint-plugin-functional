import { all as deepMerge } from "deepmerge";

import currying from "./currying";
import noMutations from "./no-mutations";
import noExceptions from "./no-exceptions";
import noObjectOrientation from "./no-object-orientation";
import noStatements from "./no-statements";

import { Config } from "../util/misc";

const config: Config = deepMerge<Config>([
  currying,
  noMutations,
  noExceptions,
  noObjectOrientation,
  noStatements
]);

export default config;
