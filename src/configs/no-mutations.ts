import { type Linter } from "@typescript-eslint/utils/ts-eslint";

import * as immutableData from "#eslint-plugin-functional/rules/immutable-data";
import * as noLet from "#eslint-plugin-functional/rules/no-let";
import * as preferImmutableTypes from "#eslint-plugin-functional/rules/prefer-immutable-types";
import * as typeDeclarationImmutability from "#eslint-plugin-functional/rules/type-declaration-immutability";

const config: Linter.Config = {
  rules: {
    [`functional/${immutableData.name}`]: "error",
    [`functional/${noLet.name}`]: "error",
    [`functional/${preferImmutableTypes.name}`]: "error",
    [`functional/${typeDeclarationImmutability.name}`]: "error",
  },
};

export default config;
