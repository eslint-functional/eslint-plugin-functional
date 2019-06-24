// These imports are easier to read when each is one a single line.
/* eslint-disable prettier/prettier */
import { name as noArrayMutationRuleName, rule as noArrayMutationRule } from "./noArrayMutation";
import { name as noClassRuleName, rule as noClassRule } from "./noClass";
import { name as noDeleteRuleName, rule as noDeleteRule } from "./noDelete";
import { name as noExpressionStatementRuleName, rule as noExpressionStatementRule } from "./noExpressionStatement";
import { name as noIfStatementRuleName, rule as noIfStatementRule } from "./noIfStatement";
import { name as noLetRuleName, rule as noLetRule } from "./noLet";
import { name as noLoopRuleName, rule as noLoopRule } from "./noLoopStatement";
import { name as noObjectMutationRuleName, rule as noObjectMutationRule } from "./noObjectMutation";
import { name as noRejectRuleName, rule as noRejectRule } from "./noReject";
import { name as noThisRuleName, rule as noThisRule } from "./noThis";
import { name as noThrowRuleName, rule as noThrowRule } from "./noThrow";
import { name as noTryRuleName, rule as noTryRule } from "./noTry";
import { name as noMethodSignatureRuleName, rule as noMethodSignatureRule } from "./noTSMethodSignature";
import { name as noMixedInterfaceRuleName, rule as noMixedInterfaceRule } from "./noTSMixedInterface";
import { name as readonlyArrayRuleName, rule as readonlyArrayRule } from "./TSReadonlyArray";
import { name as readonlyKeywordRuleName, rule as readonlyKeywordRule } from "./TSReadonlyKeyword";
/* eslint-enable prettier/prettier */

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
