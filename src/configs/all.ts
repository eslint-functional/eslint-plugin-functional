import { type Linter } from "@typescript-eslint/utils/ts-eslint";

import * as functionalParameters from "#eslint-plugin-functional/rules/functional-parameters";
import * as immutableData from "#eslint-plugin-functional/rules/immutable-data";
import * as noClasses from "#eslint-plugin-functional/rules/no-classes";
import * as noConditionalStatements from "#eslint-plugin-functional/rules/no-conditional-statements";
import * as noExpressionStatements from "#eslint-plugin-functional/rules/no-expression-statements";
import * as noLet from "#eslint-plugin-functional/rules/no-let";
import * as noLoopStatements from "#eslint-plugin-functional/rules/no-loop-statements";
import * as noMixedTypes from "#eslint-plugin-functional/rules/no-mixed-types";
import * as noPromiseReject from "#eslint-plugin-functional/rules/no-promise-reject";
import * as noReturnVoid from "#eslint-plugin-functional/rules/no-return-void";
import * as noThisExpressions from "#eslint-plugin-functional/rules/no-this-expressions";
import * as noThrowStatements from "#eslint-plugin-functional/rules/no-throw-statements";
import * as noTryStatements from "#eslint-plugin-functional/rules/no-try-statements";
import * as preferImmutableTypes from "#eslint-plugin-functional/rules/prefer-immutable-types";
import * as preferPropertySignatures from "#eslint-plugin-functional/rules/prefer-property-signatures";
import * as preferTacit from "#eslint-plugin-functional/rules/prefer-tacit";
import * as readonlyType from "#eslint-plugin-functional/rules/readonly-type";
import * as typeDeclarationImmutability from "#eslint-plugin-functional/rules/type-declaration-immutability";

const config: Linter.Config = {
  rules: {
    [`functional/${functionalParameters.name}`]: "error",
    [`functional/${immutableData.name}`]: "error",
    [`functional/${noClasses.name}`]: "error",
    [`functional/${noConditionalStatements.name}`]: "error",
    [`functional/${noExpressionStatements.name}`]: "error",
    [`functional/${noLet.name}`]: "error",
    [`functional/${noLoopStatements.name}`]: "error",
    [`functional/${noMixedTypes.name}`]: "error",
    [`functional/${noPromiseReject.name}`]: "error",
    [`functional/${noReturnVoid.name}`]: "error",
    [`functional/${noThisExpressions.name}`]: "error",
    [`functional/${noThrowStatements.name}`]: "error",
    [`functional/${noTryStatements.name}`]: "error",
    [`functional/${preferImmutableTypes.name}`]: "error",
    [`functional/${preferPropertySignatures.name}`]: "error",
    [`functional/${preferTacit.name}`]: "warn",
    [`functional/${readonlyType.name}`]: "error",
    [`functional/${typeDeclarationImmutability.name}`]: "error",
  },
};

export default config;
