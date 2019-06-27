import { ESLintUtils, TSESTree } from "@typescript-eslint/experimental-utils";
import * as Rule from "@typescript-eslint/experimental-utils/dist/ts-eslint/Rule";

// The version as defined in package.json. Note: cannot migrate this to an
// import statement because it will make TSC copy the package.json to the dist
// folder.
/* eslint-disable-next-line @typescript-eslint/no-require-imports, no-undef */
// const version = require("../../package.json").version;
import { version } from "../../package.json";

import { AllIgnoreOptions, shouldIgnore } from "../common/ignoreOptions";

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
      `https://github.com/jonaskello/tslint-immutable/blob/v${version}/README.md#${name}`
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
