import {
  name as noArrayMutationRuleName,
  rule as noArrayMutationRule
} from "./no-array-mutation";
import { name as noClassRuleName, rule as noClassRule } from "./no-class";
import { name as noDeleteRuleName, rule as noDeleteRule } from "./no-delete";
import {
  name as noExpressionStatementRuleName,
  rule as noExpressionStatementRule
} from "./no-expression-statement";
import {
  name as noIfStatementRuleName,
  rule as noIfStatementRule
} from "./no-if-statement";
import { name as noLetRuleName, rule as noLetRule } from "./no-let";
import {
  name as noLoopRuleName,
  rule as noLoopRule
} from "./no-loop-statement";
import {
  name as noObjectMutationRuleName,
  rule as noObjectMutationRule
} from "./no-object-mutation";
import { name as noRejectRuleName, rule as noRejectRule } from "./no-reject";
import { name as noThisRuleName, rule as noThisRule } from "./no-this";
import { name as noThrowRuleName, rule as noThrowRule } from "./no-throw";
import { name as noTryRuleName, rule as noTryRule } from "./no-try";
import {
  name as noMethodSignatureRuleName,
  rule as noMethodSignatureRule
} from "./no-method-signature";
import {
  name as noMixedInterfaceRuleName,
  rule as noMixedInterfaceRule
} from "./no-mixed-interface";
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
  [noArrayMutationRuleName]: noArrayMutationRule,
  [noClassRuleName]: noClassRule,
  [noDeleteRuleName]: noDeleteRule,
  [noExpressionStatementRuleName]: noExpressionStatementRule,
  [noIfStatementRuleName]: noIfStatementRule,
  [noLetRuleName]: noLetRule,
  [noLoopRuleName]: noLoopRule,
  [noMethodSignatureRuleName]: noMethodSignatureRule,
  [noMixedInterfaceRuleName]: noMixedInterfaceRule,
  [noObjectMutationRuleName]: noObjectMutationRule,
  [noRejectRuleName]: noRejectRule,
  [noThisRuleName]: noThisRule,
  [noThrowRuleName]: noThrowRule,
  [noTryRuleName]: noTryRule,
  [readonlyArrayRuleName]: readonlyArrayRule,
  [readonlyKeywordRuleName]: readonlyKeywordRule
};
