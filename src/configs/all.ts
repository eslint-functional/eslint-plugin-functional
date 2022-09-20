import type { Linter } from "eslint";

import * as functionalParameters from "~/rules/functional-parameters";
import * as immutableData from "~/rules/immutable-data";
import * as noClass from "~/rules/no-class";
import * as noConditionalStatement from "~/rules/no-conditional-statement";
import * as noExpressionStatement from "~/rules/no-expression-statement";
import * as noLet from "~/rules/no-let";
import * as noLoop from "~/rules/no-loop-statement";
import * as noMixedType from "~/rules/no-mixed-type";
import * as noPromiseReject from "~/rules/no-promise-reject";
import * as noReturnVoid from "~/rules/no-return-void";
import * as noThisExpression from "~/rules/no-this-expression";
import * as noThrowStatement from "~/rules/no-throw-statement";
import * as noTryStatement from "~/rules/no-try-statement";
import * as preferImmutableParameterTypes from "~/rules/prefer-immutable-parameter-types";
import * as preferPropertySignatures from "~/rules/prefer-property-signatures";
import * as preferTacit from "~/rules/prefer-tacit";
import * as typeDeclarationImmutability from "~/rules/type-declaration-immutability";

const config: Linter.Config = {
  rules: {
    [`functional/${functionalParameters.name}`]: "error",
    [`functional/${immutableData.name}`]: "error",
    [`functional/${noClass.name}`]: "error",
    [`functional/${noConditionalStatement.name}`]: "error",
    [`functional/${noExpressionStatement.name}`]: "error",
    [`functional/${noLet.name}`]: "error",
    [`functional/${noLoop.name}`]: "error",
    [`functional/${noMixedType.name}`]: "error",
    [`functional/${noPromiseReject.name}`]: "error",
    [`functional/${noReturnVoid.name}`]: "error",
    [`functional/${noThisExpression.name}`]: "error",
    [`functional/${noThrowStatement.name}`]: "error",
    [`functional/${noTryStatement.name}`]: "error",
    [`functional/${preferImmutableParameterTypes.name}`]: "error",
    [`functional/${preferPropertySignatures.name}`]: "error",
    [`functional/${preferTacit.name}`]: [
      "warn",
      { assumeTypes: { allowFixer: false } },
    ],
    [`functional/${typeDeclarationImmutability.name}`]: "error",
  },
};

export default config;
