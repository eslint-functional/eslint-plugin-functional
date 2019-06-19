import * as ts from "typescript";
import * as Lint from "tslint";
import * as utils from "tsutils/typeguard/2.8";
import * as Ignore from "./shared/ignore";
import {
  createInvalidNode,
  CheckNodeResult,
  createCheckNodeRule
} from "./shared/check-node";

type Options = Ignore.IgnoreLocalOption & Ignore.IgnoreOption;

export const Rule = createCheckNodeRule(
  Ignore.checkNodeWithIgnore(checkNode),
  "Unexpected let, use const instead."
);

function checkNode(
  node: ts.Node,
  ctx: Lint.WalkContext<Options>
): CheckNodeResult {
  const results = [
    checkVariableStatement(node, ctx),
    checkForStatements(node, ctx)
  ];

  return {
    invalidNodes: results.reduce(
      (merged, result) => [...merged, ...result.invalidNodes],
      []
    ),
    skipChildren: results.some(result => result.skipChildren === true)
  };
}

function checkVariableStatement(
  node: ts.Node,
  ctx: Lint.WalkContext<Options>
): CheckNodeResult {
  if (utils.isVariableStatement(node)) {
    return checkDeclarationList(node.declarationList, ctx);
  }
  return { invalidNodes: [] };
}

function checkForStatements(
  node: ts.Node,
  ctx: Lint.WalkContext<Options>
): CheckNodeResult {
  if (
    (utils.isForStatement(node) ||
      utils.isForInStatement(node) ||
      utils.isForOfStatement(node)) &&
    node.initializer &&
    utils.isVariableDeclarationList(node.initializer) &&
    Lint.isNodeFlagSet(node.initializer, ts.NodeFlags.Let)
  ) {
    return checkDeclarationList(node.initializer, ctx);
  }
  return { invalidNodes: [] };
}

function checkDeclarationList(
  declarationList: ts.VariableDeclarationList,
  ctx: Lint.WalkContext<Options>
): CheckNodeResult {
  if (Lint.isNodeFlagSet(declarationList, ts.NodeFlags.Let)) {
    // It is a let declaration, now check each variable that is declared
    const invalidVariableDeclarationNodes = [];
    // If the declaration list contains multiple variables, eg. let x = 0, y = 1, mutableZ = 3; then
    // we should only provide one fix for the list even if two variables are invalid.
    // NOTE: When we have a mix of allowed and disallowed variables in the same DeclarationList
    // there is no sure way to know if we should do a fix or not, eg. if ignore-prefix=mutable
    // and the list is "let x, mutableZ", then "x" is invalid but "mutableZ" is valid, should we change
    // "let" to "const" or not? For now we change to const if at least one variable is invalid.
    let addFix = true;
    for (const variableDeclarationNode of declarationList.declarations) {
      if (
        !Ignore.shouldIgnore(
          variableDeclarationNode,
          ctx.options,
          ctx.sourceFile
        )
      ) {
        invalidVariableDeclarationNodes.push(
          createInvalidNode(
            variableDeclarationNode,
            addFix
              ? [
                  new Lint.Replacement(
                    declarationList.getStart(ctx.sourceFile),
                    "let".length,
                    "const"
                  )
                ]
              : []
          )
        );
        addFix = false;
      }
    }
    return { invalidNodes: invalidVariableDeclarationNodes };
  }
  return { invalidNodes: [] };
}
