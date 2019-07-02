import {
  ESLintUtils,
  ParserServices as UtilParserServices,
  TSESTree
} from "@typescript-eslint/experimental-utils";
import * as Rule from "@typescript-eslint/experimental-utils/dist/ts-eslint/Rule";

import { version } from "../../package.json";
import { AllIgnoreOptions, shouldIgnore } from "../common/ignore-options";

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export type BaseOptions = Array<any>;

// "url" will be set automatically.
export type RuleMetaDataDocs = Omit<Rule.RuleMetaDataDocs, "url">;

// "docs.url" will be set automatically.
export type RuleMetaData<MessageIds extends string> = {
  docs: RuleMetaDataDocs;
} & Omit<Rule.RuleMetaData<MessageIds>, "docs">;

export type RuleContext<
  MessageIds extends string,
  Options extends BaseOptions
> = Rule.RuleContext<MessageIds, Options>;

export type ParserServices = {
  [k in keyof UtilParserServices]: Exclude<UtilParserServices[k], undefined>;
};

/**
 * Create a rule.
 */
export function createRule<
  MessageIds extends string,
  Options extends BaseOptions
>(data: {
  name: string;
  meta: RuleMetaData<MessageIds>;
  defaultOptions: Options;
  create: (
    context: RuleContext<MessageIds, Options>,
    optionsWithDefault: Options
  ) => Rule.RuleListener;
}) {
  return ESLintUtils.RuleCreator(
    name =>
      `https://github.com/jonaskello/eslint-plugin-ts-immutable/blob/v${version}/docs/rules/${name}.md`
  )(data);
}

/**
 * Create a function that processes common options and then runs the given
 * check.
 */
export function checkNode<
  Context extends RuleContext<string, BaseOptions>,
  IgnoreOptions extends AllIgnoreOptions,
  Node extends TSESTree.Node
>(
  check: (node: Node, context: Context, options: BaseOptions) => void,
  context: Context,
  ignoreOptions?: IgnoreOptions,
  otherOptions: BaseOptions = []
): (node: Node) => void {
  return (node: Node) => {
    if (ignoreOptions && shouldIgnore(node, context, ignoreOptions)) {
      return;
    }

    const options = [ignoreOptions, ...otherOptions].filter(
      option => option !== undefined
    );
    return check(node, context, options);
  };
}

/**
 * Ensure the type info is avaliable.
 */
export function getParserServices<
  Context extends RuleContext<string, BaseOptions>
>(context: Context) {
  if (
    !context.parserServices ||
    !context.parserServices.program ||
    !context.parserServices.esTreeNodeToTSNodeMap
  ) {
    /**
     * The user needs to have configured "project" in their parserOptions
     * for @typescript-eslint/parser
     */
    throw new Error(
      'You have used a rule which requires parserServices to be generated. You must therefore provide a value for the "parserOptions.project" property for @typescript-eslint/parser.'
    );
  }

  return context.parserServices as ParserServices;
}
