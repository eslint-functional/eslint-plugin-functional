import * as ts from "typescript";
import * as Lint from "tslint";
import * as utils from "tsutils/typeguard/2.8";
import {
  createInvalidNode,
  CheckNodeResult,
  createCheckNodeRule
} from "./shared/check-node";

type Options = {};

export const Rule = createCheckNodeRule(
  checkNode,
  "Method signature is mutable, use property signature with readonly modifier instead."
);

function checkNode(
  node: ts.Node,
  _ctx: Lint.WalkContext<Options>
): CheckNodeResult {
  return utils.isMethodSignature(node)
    ? { invalidNodes: [createInvalidNode(node, [])] }
    : { invalidNodes: [] };
}
