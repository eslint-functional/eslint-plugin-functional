import { ESLintUtils, TSESTree } from "@typescript-eslint/experimental-utils";
import {
  ReportDescriptor,
  RuleContext as UtilRuleContext,
  RuleListener,
  RuleMetaData as UtilRuleMetaData,
  RuleMetaDataDocs as UtilRuleMetaDataDocs,
  RuleModule
} from "@typescript-eslint/experimental-utils/dist/ts-eslint";
import { Type } from "typescript";

import { version } from "../../package.json";
import { AllIgnoreOptions, shouldIgnore } from "../common/ignore-options";

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export type BaseOptions = ReadonlyArray<any>;

// "url" will be set automatically.
export type RuleMetaDataDocs = Omit<UtilRuleMetaDataDocs, "url">;

// "docs.url" will be set automatically.
export type RuleMetaData<MessageIds extends string> = {
  readonly docs: RuleMetaDataDocs;
} & Omit<UtilRuleMetaData<MessageIds>, "docs">;

export type RuleContext<
  MessageIds extends string,
  Options extends BaseOptions
> = UtilRuleContext<MessageIds, Options>;

export type RuleResult<
  MessageIds extends string,
  Options extends BaseOptions
> = {
  readonly context: RuleContext<MessageIds, Options>;
  readonly descriptors: ReadonlyArray<ReportDescriptor<MessageIds>>;
};

type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

/**
 * Create a rule.
 */
export function createRule<
  MessageIds extends string,
  Options extends BaseOptions
>(data: {
  readonly name: string;
  readonly meta: RuleMetaData<MessageIds>;
  readonly defaultOptions: Options;
  readonly create: (
    context: RuleContext<MessageIds, Mutable<Options>>,
    optionsWithDefault: Mutable<Options>
  ) => RuleListener;
}): RuleModule<MessageIds, Options, RuleListener> {
  return ESLintUtils.RuleCreator(
    name =>
      `https://github.com/jonaskello/eslint-plugin-ts-immutable/blob/v${version}/docs/rules/${name}.md`
  )(data);
}

/**
 * Create a function that processes common options and then runs the given
 * check.
 */
// This function can't be functional as it needs to interact with 3rd-party
// libraries that aren't functional.
/* eslint-disable ts-immutable/no-return-void, ts-immutable/no-conditional-statement, ts-immutable/no-expression-statement */
export function checkNode<
  MessageIds extends string,
  Context extends RuleContext<MessageIds, BaseOptions>,
  IgnoreOptions extends AllIgnoreOptions,
  Node extends TSESTree.Node
>(
  check: (
    node: Node,
    context: Context,
    options: BaseOptions
  ) => RuleResult<MessageIds, BaseOptions>,
  context: Context,
  ignoreOptions?: IgnoreOptions,
  otherOptions: BaseOptions = []
): (node: Node) => void {
  return (node: Node) => {
    if (!ignoreOptions || !shouldIgnore(node, context, ignoreOptions)) {
      const result = check(
        node,
        context,
        [ignoreOptions, ...otherOptions].filter(option => option !== undefined)
      );

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
