import * as functionalParameters from "./functional-parameters";
import * as immutableData from "./immutable-data";
import * as noClassInheritance from "./no-class-inheritance";
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
export const rules: Readonly<{
  [functionalParameters.name]: typeof functionalParameters.rule;
  [immutableData.name]: typeof immutableData.rule;
  [noClasses.name]: typeof noClasses.rule;
  [noClassInheritance.name]: typeof noClassInheritance.rule;
  [noConditionalStatements.name]: typeof noConditionalStatements.rule;
  [noExpressionStatements.name]: typeof noExpressionStatements.rule;
  [noLet.name]: typeof noLet.rule;
  [noLoopStatements.name]: typeof noLoopStatements.rule;
  [noMixedTypes.name]: typeof noMixedTypes.rule;
  [noPromiseReject.name]: typeof noPromiseReject.rule;
  [noReturnVoid.name]: typeof noReturnVoid.rule;
  [noThisExpressions.name]: typeof noThisExpressions.rule;
  [noThrowStatements.name]: typeof noThrowStatements.rule;
  [noTryStatements.name]: typeof noTryStatements.rule;
  [preferImmutableTypes.name]: typeof preferImmutableTypes.rule;
  [preferPropertySignatures.name]: typeof preferPropertySignatures.rule;
  [preferReadonlyTypes.name]: typeof preferReadonlyTypes.rule;
  [preferTacit.name]: typeof preferTacit.rule;
  [readonlyType.name]: typeof readonlyType.rule;
  [typeDeclarationImmutability.name]: typeof typeDeclarationImmutability.rule;
}> = {
  [functionalParameters.name]: functionalParameters.rule,
  [immutableData.name]: immutableData.rule,
  [noClasses.name]: noClasses.rule,
  [noClassInheritance.name]: noClassInheritance.rule,
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
