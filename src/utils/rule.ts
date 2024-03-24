import { type TSESTree } from "@typescript-eslint/utils";
import {
  RuleCreator,
  getParserServices,
  type NamedCreateRuleMeta,
} from "@typescript-eslint/utils/eslint-utils";
import {
  type ReportDescriptor,
  type RuleContext,
  type RuleListener,
} from "@typescript-eslint/utils/ts-eslint";
import {
  Immutability,
  getTypeImmutability,
  type ImmutabilityOverrides,
} from "is-immutable-type";
import { type Node as TSNode, type Type, type TypeNode } from "typescript";

import ts from "#eslint-plugin-functional/conditional-imports/typescript";
import { getImmutabilityOverrides } from "#eslint-plugin-functional/settings";
import { __VERSION__ } from "#eslint-plugin-functional/utils/constants";
import { type ESFunction } from "#eslint-plugin-functional/utils/node-types";

/**
 * Any custom rule meta properties.
 */
export type NamedCreateRuleCustomMeta<
  T extends string,
  Options extends BaseOptions,
> = Omit<NamedCreateRuleMeta<T, Options>, "docs"> & {
  docs: {
    /**
     * Used for creating category configs and splitting the README rules list into sub-lists.
     */
    category:
      | "Currying"
      | "No Exceptions"
      | "No Mutations"
      | "No Other Paradigms"
      | "No Statements"
      | "Stylistic";

    recommended: "recommended" | "strict" | false;
    recommendedSeverity: "error" | "warn";
  } & Omit<NamedCreateRuleMeta<T, Options>["docs"], "recommended">;
};

/**
 * All options must extends this type.
 */
export type BaseOptions = ReadonlyArray<unknown>;

// eslint-disable-next-line functional/no-mixed-types
export type RuleDefinition<
  MessageIds extends string,
  Options extends BaseOptions,
> = {
  readonly meta: NamedCreateRuleCustomMeta<MessageIds, Options>;
  readonly create: (
    context: RuleDefinition<MessageIds, Options>,
  ) => RuleListener;
};

/**
 * The result all rules return.
 */
export type RuleResult<
  MessageIds extends string,
  Options extends BaseOptions,
> = Readonly<{
  context: Readonly<RuleContext<MessageIds, Options>>;
  descriptors: ReadonlyArray<ReportDescriptor<MessageIds>>;
}>;

/**
 * A map of nodes to functions that a rule operate on.
 */
export type RuleFunctionsMap<
  Node extends TSESTree.Node,
  MessageIds extends string,
  Options extends BaseOptions,
> = Readonly<{
  [K in keyof RuleListener]: (
    node: Node,
    context: RuleContext<MessageIds, Options>,
    options: Options,
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
  Context extends RuleContext<MessageIds, BaseOptions>,
  Node extends TSESTree.Node,
  Options extends BaseOptions,
>(
  check: (
    node: Node,
    context: Context,
    options: Options,
  ) => RuleResult<MessageIds, Options>,
  context: Context,
  options: Options,
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
  Options extends BaseOptions,
>(
  name: string,
  meta: NamedCreateRuleCustomMeta<MessageIds, Options>,
  defaultOptions: Options,
  ruleFunctionsMap: RuleFunctionsMap<any, MessageIds, Options>,
) {
  return createRuleUsingFunction(
    name,
    meta,
    defaultOptions,
    () => ruleFunctionsMap,
  );
}

/**
 * Create a rule.
 */
export function createRuleUsingFunction<
  MessageIds extends string,
  Options extends BaseOptions,
>(
  name: string,
  meta: NamedCreateRuleCustomMeta<MessageIds, Options>,
  defaultOptions: Options,
  createFunction: (
    context: Readonly<RuleContext<MessageIds, Options>>,
    options: Readonly<Options>,
  ) => RuleFunctionsMap<any, MessageIds, Options>,
) {
  const ruleCreator = RuleCreator(
    (ruleName) =>
      `https://github.com/eslint-functional/eslint-plugin-functional/blob/v${__VERSION__}/docs/rules/${ruleName}.md`,
  );

  return ruleCreator<Options, MessageIds>({
    name,
    meta: meta as any,
    defaultOptions,
    create: (context, options) => {
      const ruleFunctionsMap = createFunction(context, options);
      return Object.fromEntries(
        Object.entries(ruleFunctionsMap).map(([nodeSelector, ruleFunction]) => [
          nodeSelector,
          checkNode<
            MessageIds,
            Readonly<RuleContext<MessageIds, Options>>,
            TSESTree.Node,
            Options
          >(ruleFunction, context, options),
        ]),
      );
    },
  }) as unknown as RuleDefinition<MessageIds, Options>;
}

/**
 * Get the type of the the given node.
 */
export function getTypeOfNode<Context extends RuleContext<string, BaseOptions>>(
  node: TSESTree.Node,
  context: Context,
): Type {
  const parserServices = getParserServices(context);

  const checker = parserServices.program.getTypeChecker();
  const { esTreeNodeToTSNodeMap } = parserServices;

  const nodeType = checker.getTypeAtLocation(esTreeNodeToTSNodeMap.get(node));
  const constrained = checker.getBaseConstraintOfType(nodeType);
  return constrained ?? nodeType;
}

/**
 * Get the return type of the the given function node.
 */
export function getReturnTypesOfFunction<
  Context extends RuleContext<string, BaseOptions>,
>(node: TSESTree.Node, context: Context) {
  if (ts === undefined) {
    return null;
  }

  const parserServices = getParserServices(context);
  const checker = parserServices.program.getTypeChecker();
  const type = getTypeOfNode(node, context);

  const signatures = checker.getSignaturesOfType(type, ts.SignatureKind.Call);
  return signatures.map((signature) =>
    checker.getReturnTypeOfSignature(signature),
  );
}

/**
 * Does the given function have overloads?
 */
export function isImplementationOfOverload<
  Context extends RuleContext<string, BaseOptions>,
>(func: ESFunction, context: Context) {
  if (ts === undefined) {
    return false;
  }

  const parserServices = getParserServices(context);
  const checker = parserServices.program.getTypeChecker();
  const signature = parserServices.esTreeNodeToTSNodeMap.get(func);

  return checker.isImplementationOfOverload(signature) === true;
}

/**
 * Get the type immutability of the the given node or type.
 */
export function getTypeImmutabilityOfNode<
  Context extends RuleContext<string, BaseOptions>,
>(
  node: TSESTree.Node,
  context: Context,
  maxImmutability?: Immutability,
  explicitOverrides?: ImmutabilityOverrides,
): Immutability {
  if (ts === undefined) {
    return Immutability.Unknown;
  }

  const parserServices = getParserServices(context);
  const overrides =
    explicitOverrides ?? getImmutabilityOverrides(context.settings);
  const tsNode = parserServices.esTreeNodeToTSNodeMap.get(node);
  const typedNode = ts.isIdentifier(tsNode) ? tsNode.parent : tsNode;
  const typeLike =
    (typedNode as { type?: TypeNode }).type ??
    getTypeOfNode(parserServices.tsNodeToESTreeNodeMap.get(typedNode), context);

  return getTypeImmutability(
    parserServices.program,
    typeLike,
    overrides,
    // Don't use the global cache in testing environments as it may cause errors when switching between different config options.
    process.env["NODE_ENV"] !== "test",
    maxImmutability,
  );
}

/**
 * Get the type immutability of the the given type.
 */
export function getTypeImmutabilityOfType<
  Context extends RuleContext<string, BaseOptions>,
>(
  typeOrTypeNode: Type | TypeNode,
  context: Context,
  maxImmutability?: Immutability,
  explicitOverrides?: ImmutabilityOverrides,
): Immutability {
  const parserServices = getParserServices(context);
  const overrides =
    explicitOverrides ?? getImmutabilityOverrides(context.settings);

  return getTypeImmutability(
    parserServices.program,
    typeOrTypeNode,
    overrides,
    // Don't use the global cache in testing environments as it may cause errors when switching between different config options.
    process.env["NODE_ENV"] !== "test",
    maxImmutability,
  );
}

/**
 * Get the es tree node from the given ts node.
 */
export function getESTreeNode<
  Context extends Readonly<RuleContext<string, BaseOptions>>,
>(node: TSNode, context: Context): TSESTree.Node | null {
  const parserServices = getParserServices(context);
  return parserServices.tsNodeToESTreeNodeMap.get(node) ?? null;
}
