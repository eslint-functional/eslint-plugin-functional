import * as ts from "typescript";
import * as Lint from "tslint";
import * as utils from "tsutils/typeguard/2.8";
import {
  createInvalidNode,
  CheckNodeResult,
  createCheckNodeRule
} from "./shared/check-node";

type Options = {};

// tslint:disable-next-line:variable-name
export const Rule = createCheckNodeRule(
  checkNode,
  "Unexpected if, use a conditional expression (ternary operator) instead."
);

function checkNode(
  node: ts.Node,
  _ctx: Lint.WalkContext<Options>
): CheckNodeResult {
  return utils.isIfStatement(node)
    ? { invalidNodes: [createInvalidNode(node, [])] }
    : { invalidNodes: [] };
}
