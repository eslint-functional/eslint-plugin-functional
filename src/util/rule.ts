import * as Rule from "@typescript-eslint/experimental-utils/dist/ts-eslint/Rule";
import { ESLintUtils } from "@typescript-eslint/experimental-utils";

// The version as defined in package.json.
// Note: cannot migrate this to an import statement because it will make TSC
// copy the package.json to the dist folder.
/* eslint-disable-next-line @typescript-eslint/no-require-imports, no-undef */
// const version = require("../../package.json").version;
import { version } from "../../package.json";

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
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  Options extends BaseOptions
> = Rule.RuleContext<MessageIds, Options>;

/**
 * Create a rule.
 */
export function createRule<
  MessageIds extends string,
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
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
