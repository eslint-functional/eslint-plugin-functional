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
  RuleModule,
  ReportDescriptor
} from "@typescript-eslint/experimental-utils/dist/ts-eslint";

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

export type ParserServices = {
  [k in keyof UtilParserServices]: Exclude<UtilParserServices[k], undefined>;
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
