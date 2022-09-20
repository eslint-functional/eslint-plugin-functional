import type { Linter } from "eslint";

import * as immutableData from "~/rules/immutable-data";
import * as noLet from "~/rules/no-let";
import * as preferImmutableParameterTypes from "~/rules/prefer-immutable-parameter-types";
import * as typeDeclarationImmutability from "~/rules/type-declaration-immutability";

const config: Linter.Config = {
  rules: {
    [`functional/${immutableData.name}`]: "error",
    [`functional/${noLet.name}`]: "error",
    [`functional/${preferImmutableParameterTypes.name}`]: "error",
    [`functional/${typeDeclarationImmutability.name}`]: "error",
  },
};

export default config;
