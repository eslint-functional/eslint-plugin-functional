/**
 * This file has functions that enable walking the nodes
 * and just providing a CheckNodeFunction that returns invalid
 * nodes. It enables a more functional style of programming rules
 * using the CheckNodeFunction as an expression that returns errors.
 */

import * as ts from "typescript";
import * as Lint from "tslint";
import { parseOptions as defaultParseOptions } from "./options";

export interface CheckNodeFunction<TOptions> {
  (node: ts.Node, ctx: Lint.WalkContext<TOptions>): CheckNodeResult;
}

export interface CheckTypedNodeFunction<TOptions> {
  (
    node: ts.Node,
    ctx: Lint.WalkContext<TOptions>,
    checker: ts.TypeChecker
  ): CheckNodeResult;
}

export interface InvalidNode {
  readonly node: ts.Node;
  readonly replacements: Array<Lint.Replacement>;
}

export function createInvalidNode(
  node: ts.Node,
  replacements: Array<Lint.Replacement>
): InvalidNode {
  return { node, replacements };
}

export interface CheckNodeResult {
  invalidNodes: ReadonlyArray<InvalidNode>;
  skipChildren?: boolean;
}

export function walk<TOptions>(
  ctx: Lint.WalkContext<TOptions>,
  checkNode: CheckNodeFunction<TOptions>,
  failureString: string
): void {
  return ts.forEachChild(ctx.sourceFile, cb);

  function cb(node: ts.Node): void {
    // Check the node
    const { invalidNodes, skipChildren } = checkNode(node, ctx);
    reportInvalidNodes(invalidNodes, ctx, failureString);
    if (skipChildren) {
      return;
    }
    // Use return because performance hints docs say it optimizes the function using tail-call recursion
    return ts.forEachChild(node, cb);
  }
}

export function walkTyped<TOptions>(
  ctx: Lint.WalkContext<TOptions>,
  checkTypedNode: CheckTypedNodeFunction<TOptions>,
  checker: ts.TypeChecker,
  failureString: string
): void {
  return ts.forEachChild(ctx.sourceFile, cb);

  function cb(node: ts.Node): void {
    // Check the node
    const { invalidNodes, skipChildren } = checkTypedNode(node, ctx, checker);
    reportInvalidNodes(invalidNodes, ctx, failureString);
    if (skipChildren) {
      return;
    }
    // Use return because performance hints docs say it optimizes the function using tail-call recursion
    return ts.forEachChild(node, cb);
  }
}

export function createCheckNodeRule<TOptions>(
  checkNode: CheckNodeFunction<TOptions>,
  failureString: string,
  parseOptions: (ruleArguments: Array<any>) => TOptions = defaultParseOptions
): any {
  return class Rule extends Lint.Rules.AbstractRule {
    public apply(sourceFile: ts.SourceFile): Array<Lint.RuleFailure> {
      return this.applyWithFunction(
        sourceFile,
        (ctx: Lint.WalkContext<TOptions>) =>
          walk(ctx, checkNode, failureString),
        parseOptions(this.ruleArguments)
      );
    }
  };
}

export function createCheckNodeTypedRule<TOptions>(
  checkTypedNode: CheckTypedNodeFunction<TOptions>,
  failureString: string,
  parseOptions: (ruleArguments: Array<any>) => TOptions = defaultParseOptions
): any {
  return class Rule extends Lint.Rules.TypedRule {
    public applyWithProgram(
      sourceFile: ts.SourceFile,
      program: ts.Program
    ): Array<Lint.RuleFailure> {
      return this.applyWithFunction(
        sourceFile,
        (ctx: Lint.WalkContext<TOptions>, checker: ts.TypeChecker) =>
          walkTyped(ctx, checkTypedNode, checker, failureString),
        parseOptions(this.ruleArguments),
        program.getTypeChecker()
      );
    }
  };
}

function reportInvalidNodes<TOptions>(
  invalidNodes: ReadonlyArray<InvalidNode>,
  ctx: Lint.WalkContext<TOptions>,
  failureString: string
): void {
  invalidNodes.forEach(invalidNode =>
    ctx.addFailureAtNode(
      invalidNode.node,
      failureString,
      invalidNode.replacements
    )
  );
}
