import type {
  ParserServices,
  TSESLint,
  TSESTree,
} from "@typescript-eslint/utils";
import { ESLintUtils } from "@typescript-eslint/utils";
import type { Rule } from "eslint";
import type { ImmutabilityOverrides } from "is-immutable-type";
import { getTypeImmutability, Immutability } from "is-immutable-type";
import type { Node as TSNode, Type, TypeNode } from "typescript";
import { isIdentifier } from "typescript";

import ts from "~/conditional-imports/typescript";
import { getImmutabilityOverrides } from "~/settings";
import type { ESFunction } from "~/utils/node-types";

// eslint-disable-next-line @typescript-eslint/naming-convention -- This is a special var.
const __VERSION__ = "0.0.0-development";

/**
 * Any custom rule meta properties.
 */
export type NamedCreateRuleMetaWithCategory<T extends string> =
  ESLintUtils.NamedCreateRuleMeta<T> & {
    docs: {
      /** Used for splitting the README rules list into sub-lists. */
      category: string;
    };
  };

/**
 * All options must extends this type.
 */
export type BaseOptions = unknown[];

/**
 * The result all rules return.
 */
export type RuleResult<
  MessageIds extends string,
  Options extends BaseOptions
> = Readonly<{
  context: TSESLint.RuleContext<MessageIds, Options>;
  descriptors: Array<TSESLint.ReportDescriptor<MessageIds>>;
}>;

/**
 * A map of nodes to functions that a rule operate on.
 */
type RuleFunctionsMap<
  Node extends TSESTree.Node,
  MessageIds extends string,
  Options extends BaseOptions
> = Readonly<{
  [K in keyof TSESLint.RuleListener]: (
    node: Node,
    context: TSESLint.RuleContext<MessageIds, Options>,
    options: Options
  ) => RuleResult<MessageIds, Options>;
}>;

// This function can't be functional as it needs to interact with 3rd-party
// libraries that aren't functional.
/* eslint-disable functional/no-return-void, functional/no-expression-statements */
/**
 * Create a function that processes common options and then runs the given
 * check.
 */
function checkNode<
  MessageIds extends string,
  Context extends TSESLint.RuleContext<MessageIds, BaseOptions>,
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
    const result = check(node, context, options);

    // eslint-disable-next-line functional/no-loop-statements -- can't really be avoided.
    for (const descriptor of result.descriptors) {
      result.context.report(descriptor);
    }
  };
}
/* eslint-enable functional/no-return-void, functional/no-expression-statements */

/**
 * Create a rule.
 */
export function createRule<
  MessageIds extends string,
  Options extends BaseOptions
>(
  name: string,
  meta: NamedCreateRuleMetaWithCategory<MessageIds>,
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
  meta: NamedCreateRuleMetaWithCategory<MessageIds>,
  defaultOptions: Options,
  createFunction: (
    context: TSESLint.RuleContext<MessageIds, Options>,
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
        context as unknown as TSESLint.RuleContext<MessageIds, Options>,
        options as unknown as Options
      );
      return Object.fromEntries(
        Object.entries(ruleFunctionsMap).map(([nodeSelector, ruleFunction]) => [
          nodeSelector,
          checkNode(
            ruleFunction,
            context as unknown as TSESLint.RuleContext<MessageIds, Options>,
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
  Context extends TSESLint.RuleContext<string, BaseOptions>
>(node: TSESTree.Node, context: Context): Type | null;
export function getTypeOfNode(
  node: TSESTree.Node,
  parserServices: ParserServices
): Type;
export function getTypeOfNode<
  Context extends TSESLint.RuleContext<string, BaseOptions>
>(
  node: TSESTree.Node,
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

  // checker.getReturnTypeOfSignature
  const nodeType = checker.getTypeAtLocation(esTreeNodeToTSNodeMap.get(node));
  const constrained = checker.getBaseConstraintOfType(nodeType);
  return constrained ?? nodeType;
}

/**
 * Get the return type of the the given function node.
 */
export function getReturnTypesOfFunction<
  Context extends TSESLint.RuleContext<string, BaseOptions>
>(node: TSESTree.Node, context: Context) {
  if (ts === undefined) {
    return null;
  }

  const parserServices = getParserServices(context);
  if (parserServices === null) {
    return null;
  }

  const checker = parserServices.program.getTypeChecker();
  const type = getTypeOfNode(node, parserServices);

  const signatures = checker.getSignaturesOfType(type, ts.SignatureKind.Call);
  return signatures.map((signature) =>
    checker.getReturnTypeOfSignature(signature)
  );
}

/**
 * Does the given function have overloads?
 */
export function isImplementationOfOverload<
  Context extends TSESLint.RuleContext<string, BaseOptions>
>(func: ESFunction, context: Context) {
  if (ts === undefined) {
    return false;
  }

  const parserServices = getParserServices(context);
  if (parserServices === null) {
    return false;
  }

  const checker = parserServices.program.getTypeChecker();
  const signature = parserServices.esTreeNodeToTSNodeMap.get(func);

  return checker.isImplementationOfOverload(signature) === true;
}

/**
 * Get the type immutability of the the given node.
 */
export function getTypeImmutabilityOfNode<
  Context extends TSESLint.RuleContext<string, BaseOptions>
>(
  node: TSESTree.Node,
  context: Context,
  maxImmutability?: Immutability
): Immutability;

/**
 * Get the type immutability of the the given node.
 */
export function getTypeImmutabilityOfNode(
  node: TSESTree.Node,
  parserServices: ParserServices,
  maxImmutability?: Immutability,
  overrides?: ImmutabilityOverrides
): Immutability;

/**
 * Get the type immutability of the the given node or type.
 */
export function getTypeImmutabilityOfNode<
  Context extends TSESLint.RuleContext<string, BaseOptions>
>(
  node: TSESTree.Node,
  contextOrServices: Context | ParserServices,
  maxImmutability?: Immutability,
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

  const tsNode = parserServices.esTreeNodeToTSNodeMap.get(node);
  const typedNode = isIdentifier(tsNode) ? tsNode.parent : tsNode;
  const typeLike =
    ((typedNode as any).type as TypeNode | undefined) ??
    getTypeOfNode(
      parserServices.tsNodeToESTreeNodeMap.get(typedNode),
      parserServices
    );

  return getTypeImmutability(
    checker,
    typeLike,
    overrides,
    // Don't use the global cache in testing environments as it may cause errors when switching between different config options.
    process.env["NODE_ENV"] !== "test",
    maxImmutability
  );
}

/**
 * Get the type immutability of the the given type.
 */
export function getTypeImmutabilityOfType<
  Context extends TSESLint.RuleContext<string, BaseOptions>
>(
  typeOrTypeNode: Type | TypeNode,
  context: Context,
  maxImmutability?: Immutability
): Immutability;

/**
 * Get the type immutability of the the given type.
 */
export function getTypeImmutabilityOfType(
  typeOrTypeNode: Type | TypeNode,
  parserServices: ParserServices,
  maxImmutability?: Immutability,
  overrides?: ImmutabilityOverrides
): Immutability;

export function getTypeImmutabilityOfType<
  Context extends TSESLint.RuleContext<string, BaseOptions>
>(
  typeOrTypeNode: Type | TypeNode,
  contextOrServices: Context | ParserServices,
  maxImmutability?: Immutability,
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

  return getTypeImmutability(
    checker,
    typeOrTypeNode,
    overrides,
    // Don't use the global cache in testing environments as it may cause errors when switching between different config options.
    process.env["NODE_ENV"] !== "test",
    maxImmutability
  );
}

/**
 * Get the es tree node from the given ts node.
 */
export function getESTreeNode<
  Context extends TSESLint.RuleContext<string, BaseOptions>
>(node: TSNode, context: Context): TSESTree.Node | null;
export function getESTreeNode(
  node: TSNode,
  parserServices: ParserServices
): TSESTree.Node;
export function getESTreeNode<
  Context extends TSESLint.RuleContext<string, BaseOptions>
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
  Context extends TSESLint.RuleContext<string, BaseOptions>
>(context: Context) {
  const { parserServices } = context;

  if (parserServices === undefined || !parserServices.hasFullTypeInformation) {
    return null;
  }

  return parserServices;
}

/**
 * Is the given value the parser services or just the context.
 */
function isParserServices<
  Context extends TSESLint.RuleContext<string, BaseOptions>
>(
  contextOrServices: Context | ParserServices
): contextOrServices is ParserServices {
  // Only context has an id property and it will always have one.
  return !Object.hasOwn(contextOrServices, "id");
}
