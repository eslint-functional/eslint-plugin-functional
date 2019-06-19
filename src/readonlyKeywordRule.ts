import * as ts from "typescript";
import * as Lint from "tslint";
import * as utils from "tsutils/typeguard/2.8";
import * as Ignore from "./shared/ignore";
import {
  createInvalidNode,
  CheckNodeResult,
  createCheckNodeRule
} from "./shared/check-node";

type Options = Ignore.IgnoreLocalOption &
  Ignore.IgnoreOption &
  Ignore.IgnoreClassOption &
  Ignore.IgnoreInterfaceOption;

/**
 * This rule checks that the readonly keyword is used in all PropertySignature and
 * IndexerSignature nodes (which are the only places that the readonly keyword can exist).
 */
export const Rule = createCheckNodeRule(
  Ignore.checkNodeWithIgnore(checkNode),
  "A readonly modifier is required."
);

function checkNode(
  node: ts.Node,
  ctx: Lint.WalkContext<Options>
): CheckNodeResult {
  return checkPropertySignatureAndIndexSignature(node, ctx);
}

function checkPropertySignatureAndIndexSignature(
  node: ts.Node,
  ctx: Lint.WalkContext<Options>
): CheckNodeResult {
  if (
    (utils.isPropertySignature(node) ||
      utils.isIndexSignatureDeclaration(node) ||
      utils.isPropertyDeclaration(node)) &&
    !(
      node.modifiers &&
      node.modifiers.filter(m => m.kind === ts.SyntaxKind.ReadonlyKeyword)
        .length > 0
    )
  ) {
    // Check if ignore-prefix applies
    if (Ignore.shouldIgnore(node, ctx.options, ctx.sourceFile)) {
      return { invalidNodes: [] };
    }

    const start = utils.isIndexSignatureDeclaration(node)
      ? node.getStart(ctx.sourceFile)
      : node.name.getStart(ctx.sourceFile);

    return {
      invalidNodes: [
        createInvalidNode(node, [new Lint.Replacement(start, 0, "readonly ")])
      ]
    };
  }
  return { invalidNodes: [] };
}
