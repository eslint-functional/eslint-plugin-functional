import type { Linter } from "eslint";

import * as functionalParameters from "~/rules/functional-parameters";
import * as immutableData from "~/rules/immutable-data";
import * as noClasses from "~/rules/no-classes";
import * as noConditionalStatements from "~/rules/no-conditional-statements";
import * as noExpressionStatements from "~/rules/no-expression-statements";
import * as noLet from "~/rules/no-let";
import * as noLoopStatements from "~/rules/no-loop-statements";
import * as noMixedTypes from "~/rules/no-mixed-types";
import * as noPromiseReject from "~/rules/no-promise-reject";
import * as noReturnVoid from "~/rules/no-return-void";
import * as noThisExpressions from "~/rules/no-this-expressions";
import * as noThrowStatements from "~/rules/no-throw-statements";
import * as noTryStatements from "~/rules/no-try-statements";
import * as preferImmutableTypes from "~/rules/prefer-immutable-types";
import * as preferPropertySignatures from "~/rules/prefer-property-signatures";
import * as preferTacit from "~/rules/prefer-tacit";
import * as typeDeclarationImmutability from "~/rules/type-declaration-immutability";

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
    [`functional/${preferTacit.name}`]: [
      "warn",
      { assumeTypes: { allowFixer: false } },
    ],
    [`functional/${typeDeclarationImmutability.name}`]: "error",
  },
};

export default config;
