// Polyfill.
import "object.fromentries/auto.js";

import {
  ESLintUtils,
  TSESLint,
  TSESTree,
} from "@typescript-eslint/experimental-utils";
import { Rule } from "eslint";
import { Node, Type } from "typescript";

import { shouldIgnore } from "../common/ignore-options";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore -- This file is outside of the root dir (i.e. src/).
import { version } from "../../package.json";

export type BaseOptions = object;

// "url" will be set automatically.
export type RuleMetaDataDocs = Omit<TSESLint.RuleMetaDataDocs, "url">;

// "docs.url" will be set automatically.
export type RuleMetaData<MessageIds extends string> = {
  readonly docs: RuleMetaDataDocs;
} & Omit<TSESLint.RuleMetaData<MessageIds>, "docs">;

export type RuleContext<
  MessageIds extends string,
  Options extends BaseOptions
> = TSESLint.RuleContext<MessageIds, readonly [Options]>;

export type RuleResult<
  MessageIds extends string,
  Options extends BaseOptions
> = {
  readonly context: RuleContext<MessageIds, Options>;
  readonly descriptors: ReadonlyArray<TSESLint.ReportDescriptor<MessageIds>>;
};

export type RuleFunctionsMap<
  MessageIds extends string,
  Options extends BaseOptions
> = {
  readonly [K in keyof TSESLint.RuleListener]: (
    node: NonNullable<TSESLint.RuleListener[K]> extends TSESLint.RuleFunction<
      infer U
    >
      ? U
      : never,
    context: RuleContext<MessageIds, Options>,
    options: Options
  ) => RuleResult<MessageIds, Options>;
};

// This function can't be functional as it needs to interact with 3rd-party
// libraries that aren't functional.
/* eslint-disable functional/no-return-void, functional/no-conditional-statement, functional/no-expression-statement */
/**
 * Create a function that processes common options and then runs the given
 * check.
 */
function checkNode<
  MessageIds extends string,
  Context extends RuleContext<MessageIds, BaseOptions>,
  Node extends TSESTree.Node,
  Options extends BaseOptions
>(
  check: (
    node: Node,
    context: Context,
    options: Options
  ) => RuleResult<MessageIds, Options>,
  context: Context,
  options: Options
): (node: Node) => void {
  return (node: Node) => {
    if (!options || !shouldIgnore(node, context, options)) {
      const result = check(node, context, options);

      result.descriptors.forEach((descriptor) =>
        result.context.report(descriptor)
      );
    }
  };
}
/* eslint-enable functional/no-return-void, functional/no-conditional-statement, functional/no-expression-statement */

/**
 * Create a rule.
 */
export function createRule<
  MessageIds extends string,
  Options extends BaseOptions
>(
  name: string,
  meta: RuleMetaData<MessageIds>,
  defaultOptions: Options,
  ruleFunctionsMap: RuleFunctionsMap<MessageIds, Options>
): Rule.RuleModule {
  return ESLintUtils.RuleCreator(
    (name) =>
      `https://github.com/jonaskello/eslint-plugin-functional/blob/v${version}/docs/rules/${name}.md`
  )({
    name,
    meta,
    defaultOptions: [defaultOptions],
    create: (
      context: TSESLint.RuleContext<MessageIds, readonly [Options]>,
      [options]: readonly [Options]
    ) =>
      Object.fromEntries(
        Object.entries(ruleFunctionsMap).map(([nodeSelector, ruleFunction]) => [
          nodeSelector,
          checkNode(ruleFunction, context, options),
        ])
      ),
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  } as any) as any;
}

/**
 * Get the type of the the given node.
 */
export function getTypeOfNode<Context extends RuleContext<string, BaseOptions>>(
  node: TSESTree.Node,
  context: Context
): Type | null {
  const { parserServices } = context;

  if (
    parserServices === undefined ||
    parserServices.program === undefined ||
    parserServices.esTreeNodeToTSNodeMap === undefined
  ) {
    return null;
  } else {
    const checker = parserServices.program.getTypeChecker();
    const nodeType = checker.getTypeAtLocation(
      parserServices.esTreeNodeToTSNodeMap.get(node)
    );
    const constrained = checker.getBaseConstraintOfType(nodeType);
    return constrained ?? nodeType;
  }
}

/**
 * Get the es tree node from the given ts node.
 */
export function getESTreeNode<Context extends RuleContext<string, BaseOptions>>(
  node: Node,
  context: Context
): TSESTree.Node | null {
  const { parserServices } = context;

  return parserServices === undefined ||
    parserServices.program === undefined ||
    parserServices.tsNodeToESTreeNodeMap === undefined
    ? null
    : parserServices.tsNodeToESTreeNodeMap.get(node);
}
