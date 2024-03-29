import * as functionalParameters from "./functional-parameters";
import * as immutableData from "./immutable-data";
import * as noClasses from "./no-classes";
import * as noConditionalStatements from "./no-conditional-statements";
import * as noExpressionStatements from "./no-expression-statements";
import * as noLet from "./no-let";
import * as noLoopStatements from "./no-loop-statements";
import * as noMixedTypes from "./no-mixed-types";
import * as noPromiseReject from "./no-promise-reject";
import * as noReturnVoid from "./no-return-void";
import * as noThisExpressions from "./no-this-expressions";
import * as noThrowStatements from "./no-throw-statements";
import * as noTryStatements from "./no-try-statements";
import * as preferImmutableTypes from "./prefer-immutable-types";
import * as preferPropertySignatures from "./prefer-property-signatures";
import * as preferReadonlyTypes from "./prefer-readonly-type";
import * as preferTacit from "./prefer-tacit";
import * as readonlyType from "./readonly-type";
import * as typeDeclarationImmutability from "./type-declaration-immutability";

/**
 * All of the custom rules.
 */
export const rules = {
  [functionalParameters.name]: functionalParameters.rule,
  [immutableData.name]: immutableData.rule,
  [noClasses.name]: noClasses.rule,
  [noConditionalStatements.name]: noConditionalStatements.rule,
  [noExpressionStatements.name]: noExpressionStatements.rule,
  [noLet.name]: noLet.rule,
  [noLoopStatements.name]: noLoopStatements.rule,
  [noMixedTypes.name]: noMixedTypes.rule,
  [noPromiseReject.name]: noPromiseReject.rule,
  [noReturnVoid.name]: noReturnVoid.rule,
  [noThisExpressions.name]: noThisExpressions.rule,
  [noThrowStatements.name]: noThrowStatements.rule,
  [noTryStatements.name]: noTryStatements.rule,
  [preferImmutableTypes.name]: preferImmutableTypes.rule,
  [preferPropertySignatures.name]: preferPropertySignatures.rule,
  [preferReadonlyTypes.name]: preferReadonlyTypes.rule,
  [preferTacit.name]: preferTacit.rule,
  [readonlyType.name]: readonlyType.rule,
  [typeDeclarationImmutability.name]: typeDeclarationImmutability.rule,
};
