import {
  ESLintUtils,
  ParserServices as UtilParserServices,
  TSESTree
} from "@typescript-eslint/experimental-utils";
import {
  RuleContext as UtilRuleContext,
  RuleListener,
  RuleMetaData as UtilRuleMetaData,
  RuleMetaDataDocs as UtilRuleMetaDataDocs,
  RuleModule
} from "@typescript-eslint/experimental-utils/dist/ts-eslint";

import { version } from "../../package.json";
import { AllIgnoreOptions, shouldIgnore } from "../common/ignore-options";

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export type BaseOptions = Array<any>;

// "url" will be set automatically.
export type RuleMetaDataDocs = Omit<UtilRuleMetaDataDocs, "url">;

// "docs.url" will be set automatically.
export type RuleMetaData<MessageIds extends string> = {
  docs: RuleMetaDataDocs;
} & Omit<UtilRuleMetaData<MessageIds>, "docs">;

export type RuleContext<
  MessageIds extends string,
  Options extends BaseOptions
> = UtilRuleContext<MessageIds, Options>;

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
export function parserServicesAvaliable<
  Context extends RuleContext<string, BaseOptions>
>(context: Context): boolean {
  return (
    context.parserServices !== undefined &&
    context.parserServices.program !== undefined &&
    context.parserServices.esTreeNodeToTSNodeMap !== undefined
  );
}

/**
 * Ensure the type info is avaliable.
 */
export function getParserServices<
  Context extends RuleContext<string, BaseOptions>
>(context: Context): ParserServices {
  if (parserServicesAvaliable(context)) {
    return context.parserServices as ParserServices;
  }

  /**
   * The user needs to have configured "project" in their parserOptions
   * for @typescript-eslint/parser
   */
  throw new Error(
    'You have used a rule which is only avaliable for TypeScript files and requires parserServices to be generated. You must therefore provide a value for the "parserOptions.project" property for @typescript-eslint/parser.'
  );
}
