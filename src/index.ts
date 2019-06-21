import { name as noClassRuleName, rule as noClassRule } from "./rules/noClass";
import {
  name as noDeleteRuleName,
  rule as noDeleteRule
} from "./rules/noDelete";
import {
  name as noExpressionStatementRuleName,
  rule as noExpressionStatementRule
} from "./rules/noExpressionStatement";
import {
  name as noIfStatementRuleName,
  rule as noIfStatementRule
} from "./rules/noIfStatement";
import { name as noLetRuleName, rule as noLetRule } from "./rules/noLet";
import { name as noLoopRuleName, rule as noLoopRule } from "./rules/noLoop";
import {
  name as noRejectRuleName,
  rule as noRejectRule
} from "./rules/noReject";
import { name as noThisRuleName, rule as noThisRule } from "./rules/noThis";
import { name as noThrowRuleName, rule as noThrowRule } from "./rules/noThrow";
import { name as noTryRuleName, rule as noTryRule } from "./rules/noTry";

export default {
  rules: {
    [noClassRuleName]: noClassRule,
    [noDeleteRuleName]: noDeleteRule,
    [noExpressionStatementRuleName]: noExpressionStatementRule,
    [noIfStatementRuleName]: noIfStatementRule,
    [noLetRuleName]: noLetRule,
    [noLoopRuleName]: noLoopRule,
    [noRejectRuleName]: noRejectRule,
    [noThisRuleName]: noThisRule,
    [noThrowRuleName]: noThrowRule,
    [noTryRuleName]: noTryRule
  }
};
