import * as ts from "typescript";
import * as Lint from "tslint";
import * as utils from "tsutils/typeguard/2.8";
import {
  createInvalidNode,
  CheckNodeResult,
  createCheckNodeRule
} from "./shared/check-node";
import * as Ignore from "./shared/ignore";

type Options = Ignore.IgnoreOption;

export const Rule = createCheckNodeRule(
  checkNode,
  "Using expressions to cause side-effects not allowed."
);

function checkNode(
  node: ts.Node,
  ctx: Lint.WalkContext<Options>
): CheckNodeResult {
  if (utils.isExpressionStatement(node)) {
    const children = node.getChildren();
    const isYield = children.every(
      n => n.kind === ts.SyntaxKind.YieldExpression
    );
    const isIgnored = Ignore.isIgnored(
      node.expression,
      ctx.options.ignorePattern,
      ctx.options.ignorePrefix,
      ctx.options.ignoreSuffix
    );
    if (!isYield && !isIgnored) {
      return { invalidNodes: [createInvalidNode(node, [])] };
    }
  }
  return { invalidNodes: [] };
}
