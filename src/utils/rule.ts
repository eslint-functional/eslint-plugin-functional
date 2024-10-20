import assert from "node:assert/strict";

import type { TSESTree } from "@typescript-eslint/utils";
import { type NamedCreateRuleMeta, RuleCreator, getParserServices } from "@typescript-eslint/utils/eslint-utils";
import type { ReportDescriptor, RuleContext, RuleListener, RuleModule } from "@typescript-eslint/utils/ts-eslint";
import { Immutability, type ImmutabilityOverrides, getTypeImmutability } from "is-immutable-type";
import { isIntrinsicErrorType } from "ts-api-utils";
import type { Node as TSNode, Type, TypeNode } from "typescript";

import typescript from "#/conditional-imports/typescript";
import { getImmutabilityOverrides } from "#/settings";
import { __VERSION__ } from "#/utils/constants";
import type { ESFunction } from "#/utils/node-types";

import { typeMatchesPattern } from "./type-specifier";

type Docs = {
  /**
   * Used for creating category configs and splitting the README rules list into sub-lists.
   */
  category: "Currying" | "No Exceptions" | "No Mutations" | "No Other Paradigms" | "No Statements" | "Stylistic";

  recommended: "recommended" | "strict" | false;
  recommendedSeverity: "error" | "warn";

  requiresTypeChecking: boolean;

  url?: never;
};

/**
 * Any custom rule meta properties.
 */
export type NamedCreateRuleCustomMeta<T extends string> = NamedCreateRuleMeta<T, Docs>;

/**
 * The definition of a rule.
 */
export type Rule<MessageIds extends string, Options extends ReadonlyArray<unknown>> = RuleModule<
  MessageIds,
  Options,
  Docs
> & {
  meta: NamedCreateRuleCustomMeta<MessageIds>;
};

/**
 * All options must extends this type.
 */
export type BaseOptions = ReadonlyArray<unknown>;

/**
 * The result all rules return.
 */
export type RuleResult<MessageIds extends string, Options extends BaseOptions> = Readonly<{
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
  check: (node: Node, context: Context, options: Options) => RuleResult<MessageIds, Options>,
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

/**
 * Create a rule.
 */
export function createRule<MessageIds extends string, Options extends BaseOptions>(
  name: string,
  meta: Readonly<NamedCreateRuleCustomMeta<MessageIds>>,
  defaultOptions: Options,
  ruleFunctionsMap: RuleFunctionsMap<any, MessageIds, Options>,
): Rule<MessageIds, Options> {
  return createRuleUsingFunction(name, meta, defaultOptions, () => ruleFunctionsMap);
}

/**
 * Create a rule.
 */
export function createRuleUsingFunction<MessageIds extends string, Options extends BaseOptions>(
  name: string,
  meta: Readonly<NamedCreateRuleCustomMeta<MessageIds>>,
  defaultOptions: Options,
  createFunction: (
    context: Readonly<RuleContext<MessageIds, Options>>,
    options: Readonly<Options>,
  ) => RuleFunctionsMap<any, MessageIds, Options>,
): Rule<MessageIds, Options> {
  const ruleCreator = RuleCreator<Docs>(
    (ruleName) =>
      `https://github.com/eslint-functional/eslint-plugin-functional/blob/v${__VERSION__}/docs/rules/${ruleName}.md`,
  );

  return ruleCreator<Options, MessageIds>({
    name,
    meta,
    defaultOptions,
    create: (context, options) => {
      const ruleFunctionsMap = createFunction(context, options);
      return Object.fromEntries(
        Object.entries(ruleFunctionsMap).map(([nodeSelector, ruleFunction]) => [
          nodeSelector,
          checkNode<MessageIds, Readonly<RuleContext<MessageIds, Options>>, TSESTree.Node, Options>(
            ruleFunction,
            context,
            options,
          ),
        ]),
      );
    },
  }) as Rule<MessageIds, Options>;
}

/**
 * Get the type of the the given node.
 */
export function getTypeOfNode<Context extends RuleContext<string, BaseOptions>>(
  node: TSESTree.Node,
  context: Context,
): Type {
  assert(typescript !== undefined);

  const { esTreeNodeToTSNodeMap } = getParserServices(context);

  const tsNode = esTreeNodeToTSNodeMap.get(node);
  return getTypeOfTSNode(tsNode, context);
}

/**
 * Get the type of the the given node.
 */
export function getTypeNodeOfNode<Context extends RuleContext<string, BaseOptions>>(
  node: TSESTree.Node,
  context: Context,
): TypeNode | null {
  assert(typescript !== undefined);

  const { esTreeNodeToTSNodeMap } = getParserServices(context);

  const tsNode = esTreeNodeToTSNodeMap.get(node) as TSNode & {
    type?: TypeNode;
  };
  return tsNode.type ?? null;
}

/**
 * Get the type of the the given node.
 */
export function getTypeDataOfNode<Context extends RuleContext<string, BaseOptions>>(
  node: TSESTree.Node,
  context: Context,
): [Type, TypeNode | null] {
  assert(typescript !== undefined);

  const { esTreeNodeToTSNodeMap } = getParserServices(context);

  const tsNode = esTreeNodeToTSNodeMap.get(node) as TSNode & {
    type?: TypeNode;
  };
  return [getTypeOfTSNode(tsNode, context), tsNode.type ?? null];
}

/**
 * Get the type of the the given ts node.
 */
export function getTypeOfTSNode<Context extends RuleContext<string, BaseOptions>>(
  node: TSNode,
  context: Context,
): Type {
  const { program } = getParserServices(context);
  const checker = program.getTypeChecker();

  const nodeType = checker.getTypeAtLocation(node);
  const constrained = checker.getBaseConstraintOfType(nodeType);
  return constrained ?? nodeType;
}

/**
 * Get the return type of the the given function node.
 */
export function getReturnTypesOfFunction<Context extends RuleContext<string, BaseOptions>>(
  node: TSESTree.Node,
  context: Context,
): Type[] | null {
  if (typescript === undefined) {
    return null;
  }

  const parserServices = getParserServices(context);
  const checker = parserServices.program.getTypeChecker();
  const type = getTypeOfNode(node, context);

  const signatures = checker.getSignaturesOfType(type, typescript.SignatureKind.Call);
  return signatures.map((signature) => checker.getReturnTypeOfSignature(signature));
}

/**
 * Does the given function have overloads?
 */
export function isImplementationOfOverload<Context extends RuleContext<string, BaseOptions>>(
  func: ESFunction,
  context: Context,
): boolean {
  if (typescript === undefined) {
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
export function getTypeImmutabilityOfNode<Context extends RuleContext<string, BaseOptions>>(
  node: TSESTree.Node,
  context: Context,
  maxImmutability?: Immutability,
  explicitOverrides?: ImmutabilityOverrides,
): Immutability {
  if (typescript === undefined) {
    return Immutability.Unknown;
  }

  const parserServices = getParserServices(context);
  const overrides = explicitOverrides ?? getImmutabilityOverrides(context.settings);
  const tsNode = parserServices.esTreeNodeToTSNodeMap.get(node);
  let mut_typeLike: Type | TypeNode | undefined = (tsNode as { type?: TypeNode }).type;

  if (mut_typeLike === undefined) {
    mut_typeLike = getTypeOfTSNode(tsNode, context);
    if (isIntrinsicErrorType(mut_typeLike)) {
      return Immutability.Unknown;
    }
  }

  return getTypeImmutability(
    parserServices.program,
    mut_typeLike,
    overrides,
    // Don't use the global cache in testing environments as it may cause errors when switching between different config options.
    process.env["NODE_ENV"] !== "test",
    maxImmutability,
    typeMatchesPattern,
  );
}

/**
 * Get the type immutability of the the given type.
 */
export function getTypeImmutabilityOfType<Context extends RuleContext<string, BaseOptions>>(
  typeOrTypeNode: Type | TypeNode,
  context: Context,
  maxImmutability?: Immutability,
  explicitOverrides?: ImmutabilityOverrides,
): Immutability {
  const parserServices = getParserServices(context);
  const overrides = explicitOverrides ?? getImmutabilityOverrides(context.settings);

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
export function getESTreeNode<Context extends Readonly<RuleContext<string, BaseOptions>>>(
  node: TSNode,
  context: Context,
): TSESTree.Node | null {
  const parserServices = getParserServices(context);
  return parserServices.tsNodeToESTreeNodeMap.get(node) ?? null;
}
