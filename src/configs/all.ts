import type { Linter } from "eslint";

import * as functionalParameters from "~/rules/functional-parameters";
import * as immutableData from "~/rules/immutable-data";
import * as noClasses from "~/rules/no-classes";
import * as noConditionalStatements from "~/rules/no-conditional-statements";
import * as noExpressionStatements from "~/rules/no-expression-statements";
import * as noLet from "~/rules/no-let";
import * as noLoopStatements from "~/rules/no-loop-statements";
import * as noMixedType from "~/rules/no-mixed-type";
import * as noPromiseReject from "~/rules/no-promise-reject";
import * as noReturnVoid from "~/rules/no-return-void";
import * as noThisExpression from "~/rules/no-this-expression";
import * as noThrowStatement from "~/rules/no-throw-statement";
import * as noTryStatement from "~/rules/no-try-statement";
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
    [`functional/${noMixedType.name}`]: "error",
    [`functional/${noPromiseReject.name}`]: "error",
    [`functional/${noReturnVoid.name}`]: "error",
    [`functional/${noThisExpression.name}`]: "error",
    [`functional/${noThrowStatement.name}`]: "error",
    [`functional/${noTryStatement.name}`]: "error",
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
