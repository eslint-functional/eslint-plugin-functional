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
  "Unexpected this, use functions not classes."
);

function checkNode(
  node: ts.Node,
  _ctx: Lint.WalkContext<Options>
): CheckNodeResult {
  return node.kind === ts.SyntaxKind.ThisKeyword
    ? { invalidNodes: [createInvalidNode(node, [])] }
    : { invalidNodes: [] };
}
