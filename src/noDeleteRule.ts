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
  "Unexpected delete, objects should be considered immutable."
);

function checkNode(
  node: ts.Node,
  _ctx: Lint.WalkContext<Options>
): CheckNodeResult {
  return utils.isDeleteExpression(node)
    ? { invalidNodes: [createInvalidNode(node, [])] }
    : { invalidNodes: [] };
}
