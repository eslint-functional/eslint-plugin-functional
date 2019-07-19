import { ESLintUtils, TSESTree } from "@typescript-eslint/experimental-utils";
import {
  ReportDescriptor,
  RuleContext as UtilRuleContext,
  RuleListener,
  RuleMetaData as UtilRuleMetaData,
  RuleMetaDataDocs as UtilRuleMetaDataDocs
} from "@typescript-eslint/experimental-utils/dist/ts-eslint";
import { Rule } from "eslint";
import { Type } from "typescript";

import { version } from "../../package.json";
import { shouldIgnore } from "../common/ignore-options";

export type BaseOptions = object;

// "url" will be set automatically.
export type RuleMetaDataDocs = Omit<UtilRuleMetaDataDocs, "url">;

// "docs.url" will be set automatically.
export type RuleMetaData<MessageIds extends string> = {
  readonly docs: RuleMetaDataDocs;
} & Omit<UtilRuleMetaData<MessageIds>, "docs">;

export type RuleContext<
  MessageIds extends string,
  Options extends BaseOptions
> = UtilRuleContext<MessageIds, readonly [Options]>;

export type RuleResult<
  MessageIds extends string,
  Options extends BaseOptions
> = {
  readonly context: RuleContext<MessageIds, Options>;
  readonly descriptors: ReadonlyArray<ReportDescriptor<MessageIds>>;
};

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
  create: (
    context: UtilRuleContext<MessageIds, readonly [Options]>,
    optionsWithDefault: Options
  ) => RuleListener
): Rule.RuleModule {
  return ESLintUtils.RuleCreator(
    name =>
      `https://github.com/jonaskello/eslint-plugin-ts-immutable/blob/v${version}/docs/rules/${name}.md`
  )({
    name,
    meta,
    defaultOptions: [defaultOptions],
    create: (
      c: UtilRuleContext<MessageIds, readonly [Options]>,
      [o]: readonly [Options]
    ) => create(c, o)
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  } as any) as any;
}

// This function can't be functional as it needs to interact with 3rd-party
// libraries that aren't functional.
/* eslint-disable ts-immutable/no-return-void, ts-immutable/no-conditional-statement, ts-immutable/no-expression-statement */
/**
 * Create a function that processes common options and then runs the given
 * check.
 */
export function checkNode<
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

      result.descriptors.forEach(descriptor =>
        result.context.report(descriptor)
      );
    }
  };
}
/* eslint-enable ts-immutable/no-return-void, ts-immutable/no-conditional-statement, ts-immutable/no-expression-statement */

/**
 * Get the type of the the given node.
 */
export function getTypeOfNode<Context extends RuleContext<string, BaseOptions>>(
  node: TSESTree.Node,
  context: Context
): Type | null {
  const parserServices = context.parserServices;

  return parserServices === undefined ||
    parserServices.program === undefined ||
    parserServices.esTreeNodeToTSNodeMap === undefined
    ? null
    : parserServices.program
        .getTypeChecker()
        .getTypeAtLocation(parserServices.esTreeNodeToTSNodeMap.get(node));
}
