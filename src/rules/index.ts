import {
  name as functionalParametersName,
  rule as functionalParameters
} from "./functional-parameters";
import {
  name as immutableDataRuleName,
  rule as immutableDataRule
} from "./immutable-data";
import { name as noClassRuleName, rule as noClassRule } from "./no-class";
import {
  name as noConditionalStatementRuleName,
  rule as noConditionalStatementRule
} from "./no-conditional-statement";
import {
  name as noExpressionStatementRuleName,
  rule as noExpressionStatementRule
} from "./no-expression-statement";
import { name as noLetRuleName, rule as noLetRule } from "./no-let";
import {
  name as noLoopRuleName,
  rule as noLoopRule
} from "./no-loop-statement";
import {
  name as noMethodSignatureRuleName,
  rule as noMethodSignatureRule
} from "./no-method-signature";
import {
  name as noMixedInterfaceRuleName,
  rule as noMixedInterfaceRule
} from "./no-mixed-type";
import {
  name as noPromiseRejectRuleName,
  rule as noPromiseRejectRule
} from "./no-promise-reject";
import {
  name as noReturnVoidName,
  rule as noReturnVoid
} from "./no-return-void";
import {
  name as noThisExpressionRuleName,
  rule as noThisExpressionRule
} from "./no-this-expression";
import {
  name as noThrowStatementRuleName,
  rule as noThrowStatementRule
} from "./no-throw-statement";
import {
  name as noTryStatementRuleName,
  rule as noTryStatementRule
} from "./no-try-statement";
import {
  name as preferReadonlyTypesRuleName,
  rule as preferReadonlyTypesRule
} from "./prefer-readonly-type";
import {
  name as preferTypeRuleName,
  rule as preferTypeRule
} from "./prefer-type-literal";

/**
 * All of the custom rules.
 */
export const rules = {
  [functionalParametersName]: functionalParameters,
  [immutableDataRuleName]: immutableDataRule,
  [noClassRuleName]: noClassRule,
  [noConditionalStatementRuleName]: noConditionalStatementRule,
  [noExpressionStatementRuleName]: noExpressionStatementRule,
  [noLetRuleName]: noLetRule,
  [noLoopRuleName]: noLoopRule,
  [noMethodSignatureRuleName]: noMethodSignatureRule,
  [noMixedInterfaceRuleName]: noMixedInterfaceRule,
  [noPromiseRejectRuleName]: noPromiseRejectRule,
  [noReturnVoidName]: noReturnVoid,
  [noThisExpressionRuleName]: noThisExpressionRule,
  [noThrowStatementRuleName]: noThrowStatementRule,
  [noTryStatementRuleName]: noTryStatementRule,
  [preferReadonlyTypesRuleName]: preferReadonlyTypesRule,
  [preferTypeRuleName]: preferTypeRule
};
