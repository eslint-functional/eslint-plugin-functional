import { all as deepMerge } from "deepmerge";

import currying from "./currying";
import immutable from "./immutable";
import noExceptions from "./no-exceptions";
import noObjectOrientation from "./no-object-orientation";
import noStatements from "./no-statements";

const config = deepMerge([
  currying,
  immutable,
  noExceptions,
  noObjectOrientation,
  noStatements
]);

export default config;
