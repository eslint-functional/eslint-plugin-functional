import type {
  ParserServices,
  TSESLint,
  TSESTree,
} from "@typescript-eslint/utils";
import { ESLintUtils } from "@typescript-eslint/utils";
import type { Rule } from "eslint";
import type { ImmutabilityOverrides } from "is-immutable-type";
import { getTypeImmutability, Immutability } from "is-immutable-type";
import type { ReadonlyDeep } from "type-fest";
import type { Node as TSNode, Type } from "typescript";

import { getImmutabilityOverrides } from "~/settings";

// eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle -- This is a special var.
const __VERSION__ = "0.0.0-development";

/**
 * All options must extends this type.
 */
export type BaseOptions = ReadonlyArray<unknown>;

/**
 * The result all rules return.
 */
export type RuleResult<
  MessageIds extends string,
  Options extends BaseOptions
> = Readonly<{
  context: ReadonlyDeep<TSESLint.RuleContext<MessageIds, Options>>;
  descriptors: ReadonlyArray<
    ReadonlyDeep<TSESLint.ReportDescriptor<MessageIds>>
  >;
}>;

/**
 * A map of nodes to functions that a rule operate on.
 */
type RuleFunctionsMap<
  Node extends ReadonlyDeep<TSESTree.Node>,
  MessageIds extends string,
  Options extends BaseOptions
> = Readonly<{
  [K in keyof TSESLint.RuleListener]: (
    node: Node,
    context: ReadonlyDeep<TSESLint.RuleContext<MessageIds, Options>>,
    options: Options
  ) => RuleResult<MessageIds, Options>;
}>;

// This function can't be functional as it needs to interact with 3rd-party
// libraries that aren't functional.
/* eslint-disable functional/no-return-void, functional/no-expression-statement */
/**
 * Create a function that processes common options and then runs the given
 * check.
 */
function checkNode<
  MessageIds extends string,
  Context extends ReadonlyDeep<TSESLint.RuleContext<MessageIds, BaseOptions>>,
  Node extends ReadonlyDeep<TSESTree.Node>,
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
    const result = check(node, context, options);

    // eslint-disable-next-line functional/no-loop-statement -- can't really be avoided.
    for (const descriptor of result.descriptors) {
      result.context.report(
        descriptor as TSESLint.ReportDescriptor<MessageIds>
      );
    }
  };
}
/* eslint-enable functional/no-return-void, functional/no-expression-statement */

/**
 * Create a rule.
 */
export function createRule<
  MessageIds extends string,
  Options extends BaseOptions
>(
  name: string,
  meta: ESLintUtils.NamedCreateRuleMeta<MessageIds>,
  defaultOptions: Options,
  ruleFunctionsMap: RuleFunctionsMap<any, MessageIds, Options>
): Rule.RuleModule {
  return createRuleUsingFunction(
    name,
    meta,
    defaultOptions,
    () => ruleFunctionsMap
  );
}

/**
 * Create a rule.
 */
export function createRuleUsingFunction<
  MessageIds extends string,
  Options extends BaseOptions
>(
  name: string,
  meta: ESLintUtils.NamedCreateRuleMeta<MessageIds>,
  defaultOptions: Options,
  createFunction: (
    context: ReadonlyDeep<TSESLint.RuleContext<MessageIds, Options>>,
    options: Options
  ) => RuleFunctionsMap<any, MessageIds, Options>
): Rule.RuleModule {
  return ESLintUtils.RuleCreator(
    (ruleName) =>
      `https://github.com/eslint-functional/eslint-plugin-functional/blob/v${__VERSION__}/docs/rules/${ruleName}.md`
  )({
    name,
    meta,
    defaultOptions,
    create: (context, options) => {
      const ruleFunctionsMap = createFunction(
        context as unknown as ReadonlyDeep<
          TSESLint.RuleContext<MessageIds, Options>
        >,
        options as unknown as Options
      );
      return Object.fromEntries(
        Object.entries(ruleFunctionsMap).map(([nodeSelector, ruleFunction]) => [
          nodeSelector,
          checkNode(
            ruleFunction,
            context as unknown as ReadonlyDeep<
              TSESLint.RuleContext<MessageIds, Options>
            >,
            options as unknown as Options
          ),
        ])
      );
    },
  }) as unknown as Rule.RuleModule;
}

/**
 * Get the type of the the given node.
 */
export function getTypeOfNode<
  Context extends ReadonlyDeep<TSESLint.RuleContext<string, BaseOptions>>
>(node: ReadonlyDeep<TSESTree.Node>, context: Context): Type | null;
export function getTypeOfNode(
  node: ReadonlyDeep<TSESTree.Node>,
  parserServices: ParserServices
): Type;
export function getTypeOfNode<
  Context extends ReadonlyDeep<TSESLint.RuleContext<string, BaseOptions>>
>(
  node: ReadonlyDeep<TSESTree.Node>,
  contextOrServices: Context | ParserServices
): Type | null {
  const parserServices = isParserServices(contextOrServices)
    ? contextOrServices
    : getParserServices(contextOrServices);

  if (parserServices === null) {
    return null;
  }

  const checker = parserServices.program.getTypeChecker();
  const { esTreeNodeToTSNodeMap } = parserServices;

  const nodeType = checker.getTypeAtLocation(
    esTreeNodeToTSNodeMap.get(node as TSESTree.Node)
  );
  const constrained = checker.getBaseConstraintOfType(nodeType);
  return constrained ?? nodeType;
}

/**
 * Get the type immutability of the the given node.
 */
export function getTypeImmutabilityOfNode<
  Context extends ReadonlyDeep<TSESLint.RuleContext<string, BaseOptions>>
>(node: ReadonlyDeep<TSESTree.Node>, context: Context): Immutability;

/**
 * Get the type immutability of the the given node.
 */
export function getTypeImmutabilityOfNode(
  node: ReadonlyDeep<TSESTree.Node>,
  parserServices: ParserServices,
  overrides?: ImmutabilityOverrides
): Immutability;

export function getTypeImmutabilityOfNode<
  Context extends ReadonlyDeep<TSESLint.RuleContext<string, BaseOptions>>
>(
  node: ReadonlyDeep<TSESTree.Node>,
  contextOrServices: Context | ParserServices,
  explicitOverrides?: ImmutabilityOverrides
): Immutability {
  const givenParserServices = isParserServices(contextOrServices);

  const parserServices = givenParserServices
    ? contextOrServices
    : getParserServices(contextOrServices);

  const overrides = givenParserServices
    ? explicitOverrides
    : getImmutabilityOverrides(contextOrServices.settings);

  if (parserServices === null) {
    return Immutability.Unknown;
  }

  const checker = parserServices.program.getTypeChecker();

  const type = getTypeOfNode(node, parserServices);
  return getTypeImmutability(
    checker,
    type,
    overrides,
    // Don't use the global cache in testing environments as it may cause errors when switching between different config options.
    process.env.NODE_ENV !== "test"
  );
}

/**
 * Get the es tree node from the given ts node.
 */
export function getESTreeNode<
  Context extends ReadonlyDeep<TSESLint.RuleContext<string, BaseOptions>>
>(node: TSNode, context: Context): TSESTree.Node | null;
export function getESTreeNode(
  node: TSNode,
  parserServices: ParserServices
): TSESTree.Node;
export function getESTreeNode<
  Context extends ReadonlyDeep<TSESLint.RuleContext<string, BaseOptions>>
>(
  node: TSNode,
  contextOrServices: Context | ParserServices
): TSESTree.Node | null {
  const parserServices = isParserServices(contextOrServices)
    ? contextOrServices
    : getParserServices(contextOrServices);

  if (parserServices === null) {
    return null;
  }

  return parserServices.tsNodeToESTreeNodeMap.get(node);
}

/**
 * Get the parser services from the given context.
 */
function getParserServices<
  Context extends ReadonlyDeep<TSESLint.RuleContext<string, BaseOptions>>
>(context: Context) {
  const { parserServices } = context;

  if (
    parserServices === undefined ||
    !parserServices.hasFullTypeInformation ||
    parserServices.program === undefined
  ) {
    return null;
  }

  return parserServices;
}

/**
 * Is the given value the parser services or just the context.
 */
function isParserServices<
  Context extends ReadonlyDeep<TSESLint.RuleContext<string, BaseOptions>>
>(
  contextOrServices: Context | ParserServices
): contextOrServices is ParserServices {
  // Only context has an id property and it will always have one.
  return !Object.prototype.hasOwnProperty.call(contextOrServices, "id");
}
