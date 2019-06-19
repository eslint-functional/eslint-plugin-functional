import * as ts from "typescript";
import * as Lint from "tslint";
import {
  createInvalidNode,
  CheckNodeResult,
  createCheckNodeRule
} from "./shared/check-node";

type Options = {};

export const Rule = createCheckNodeRule(
  checkNode,
  "Unexpected reject, return an error instead."
);

function checkNode(
  node: ts.Node,
  _ctx: Lint.WalkContext<Options>
): CheckNodeResult {
  if (
    ts.isPropertyAccessExpression(node) &&
    ts.isIdentifier(node.expression) &&
    node.expression.text === "Promise" &&
    node.name.text === "reject"
  ) {
    return { invalidNodes: [createInvalidNode(node, [])] };
  }
  return { invalidNodes: [] };
}
