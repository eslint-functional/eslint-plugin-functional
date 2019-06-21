import * as Rule from "@typescript-eslint/experimental-utils/dist/ts-eslint/Rule";
import { ESLintUtils } from "@typescript-eslint/experimental-utils";

// The version as defined in package.json.
// Note: cannot migrate this to an import statement because it will make TSC
// copy the package.json to the dist folder.
/* eslint-disable-next-line @typescript-eslint/no-require-imports, no-undef */
const version = require("../../package.json").version;

// "url" will be set automatically.
export type RuleMetaDataDocs = Omit<Rule.RuleMetaDataDocs, "url">;

// "docs.url" will be set automatically.
export type RuleMetaData<MessageIds extends string> = {
  docs: RuleMetaDataDocs;
} & Omit<Rule.RuleMetaData<MessageIds>, "docs">;

export type RuleContext<
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  Options extends Array<any>,
  MessageIds extends string
> = Rule.RuleContext<MessageIds, Options>;

/**
 * Create a rule.
 */
export function createRule<
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  Options extends Array<any>,
  MessageIds extends string
>(data: {
  name: string;
  meta: RuleMetaData<MessageIds>;
  defaultOptions: Options;
  create: (
    context: RuleContext<Options, MessageIds>,
    optionsWithDefault: Options
  ) => Rule.RuleListener;
}) {
  return ESLintUtils.RuleCreator(
    name =>
      `https://github.com/jonaskello/tslint-immutable/blob/v${version}/README.md#${name}`
  )(data);
}
