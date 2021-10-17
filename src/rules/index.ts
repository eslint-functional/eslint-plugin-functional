import * as functionalParameters from "./functional-parameters";
import * as immutableData from "./immutable-data";
import * as noClass from "./no-class";
import * as noConditionalStatement from "./no-conditional-statement";
import * as noExpressionStatement from "./no-expression-statement";
import * as noLet from "./no-let";
import * as noLoop from "./no-loop-statement";
import * as noMethodSignature from "./no-method-signature";
import * as noMixedType from "./no-mixed-type";
import * as noPromiseReject from "./no-promise-reject";
import * as noReturnVoid from "./no-return-void";
import * as noThisExpression from "./no-this-expression";
import * as noThrowStatement from "./no-throw-statement";
import * as noTryStatement from "./no-try-statement";
import * as preferReadonlyTypes from "./prefer-readonly-type";
import * as preferReadonlyTypesDeclaration from "./prefer-readonly-type-declaration";
import * as preferTacit from "./prefer-tacit";

/**
 * All of the custom rules.
 */
export const rules = {
  [functionalParameters.name]: functionalParameters.rule,
  [immutableData.name]: immutableData.rule,
  [noClass.name]: noClass.rule,
  [noConditionalStatement.name]: noConditionalStatement.rule,
  [noExpressionStatement.name]: noExpressionStatement.rule,
  [noLet.name]: noLet.rule,
  [noLoop.name]: noLoop.rule,
  [noMethodSignature.name]: noMethodSignature.rule,
  [noMixedType.name]: noMixedType.rule,
  [noPromiseReject.name]: noPromiseReject.rule,
  [noReturnVoid.name]: noReturnVoid.rule,
  [noThisExpression.name]: noThisExpression.rule,
  [noThrowStatement.name]: noThrowStatement.rule,
  [noTryStatement.name]: noTryStatement.rule,
  [preferReadonlyTypes.name]: preferReadonlyTypes.rule,
  [preferReadonlyTypesDeclaration.name]: preferReadonlyTypesDeclaration.rule,
  [preferTacit.name]: preferTacit.rule,
};
