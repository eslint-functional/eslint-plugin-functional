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
  name as noReturnVoidName,
  rule as noReturnVoid
} from "./no-return-void";
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
} from "./no-mixed-interface";
import { name as noRejectRuleName, rule as noRejectRule } from "./no-reject";
import { name as noThisRuleName, rule as noThisRule } from "./no-this";
import { name as noThrowRuleName, rule as noThrowRule } from "./no-throw";
import { name as noTryRuleName, rule as noTryRule } from "./no-try";
import {
  name as readonlyArrayRuleName,
  rule as readonlyArrayRule
} from "./readonly-array";
import {
  name as readonlyKeywordRuleName,
  rule as readonlyKeywordRule
} from "./readonly-keyword";

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
  [noRejectRuleName]: noRejectRule,
  [noReturnVoidName]: noReturnVoid,
  [noThisRuleName]: noThisRule,
  [noThrowRuleName]: noThrowRule,
  [noTryRuleName]: noTryRule,
  [readonlyArrayRuleName]: readonlyArrayRule,
  [readonlyKeywordRuleName]: readonlyKeywordRule
};
