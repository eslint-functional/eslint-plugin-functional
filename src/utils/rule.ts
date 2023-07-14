import assert from "node:assert/strict";

import {
  type ParserServices,
  type ParserServicesWithTypeInformation,
  type TSESTree,
} from "@typescript-eslint/utils";
import {
  getParserServices,
  type NamedCreateRuleMeta,
  RuleCreator,
} from "@typescript-eslint/utils/eslint-utils";
import {
  type RuleContext,
  type RuleModule,
  type ReportDescriptor,
  type RuleListener,
} from "@typescript-eslint/utils/ts-eslint";
import { type ImmutabilityOverrides } from "is-immutable-type";
import { getTypeImmutability, Immutability } from "is-immutable-type";
import { type Node as TSNode, type Type, type TypeNode } from "typescript";

import ts from "~/conditional-imports/typescript";
import { getImmutabilityOverrides } from "~/settings";
import { type ESFunction } from "~/utils/node-types";

// eslint-disable-next-line @typescript-eslint/naming-convention -- This is a special var.
const __VERSION__ = "0.0.0-development";

/**
 * Any custom rule meta properties.
 */
export type NamedCreateRuleMetaWithCategory<T extends string> =
  NamedCreateRuleMeta<T> & {
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
  Options extends BaseOptions,
> = Readonly<{
  context: Readonly<RuleContext<MessageIds, Options>>;
  descriptors: ReadonlyArray<ReportDescriptor<MessageIds>>;
}>;

/**
 * A map of nodes to functions that a rule operate on.
 */
type RuleFunctionsMap<
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
  meta: NamedCreateRuleMetaWithCategory<MessageIds>,
  defaultOptions: Options,
  ruleFunctionsMap: RuleFunctionsMap<any, MessageIds, Options>,
): RuleModule<MessageIds, Options> {
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
  meta: NamedCreateRuleMetaWithCategory<MessageIds>,
  defaultOptions: Options,
  createFunction: (
    context: Readonly<RuleContext<MessageIds, Options>>,
    options: Readonly<Options>,
  ) => RuleFunctionsMap<any, MessageIds, Options>,
): RuleModule<MessageIds, Options> {
  const ruleCreator = RuleCreator(
    (ruleName) =>
      `https://github.com/eslint-functional/eslint-plugin-functional/blob/v${__VERSION__}/docs/rules/${ruleName}.md`,
  );

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion -- false positive
  return ruleCreator<Options, MessageIds>({
    name,
    meta,
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
  }) as RuleModule<MessageIds, Options>;
}

/**
 * Get the type of the the given node.
 */
export function getTypeOfNode<Context extends RuleContext<string, BaseOptions>>(
  node: TSESTree.Node,
  context: Context,
  allowWithoutFullTypeInformation = false,
): Type | null {
  const parserServices = getParserServices(
    context,
    allowWithoutFullTypeInformation,
  );

  if (!isParserServicesWithTypeInformation(parserServices)) {
    return null;
  }

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

  const parserServices = getParserServices(context, true);
  if (!isParserServicesWithTypeInformation(parserServices)) {
    return null;
  }

  const checker = parserServices.program.getTypeChecker();
  const type = getTypeOfNode(node, context);
  assert(type !== null);

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

  const parserServices = getParserServices(context, true);
  if (!isParserServicesWithTypeInformation(parserServices)) {
    return false;
  }

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

  const parserServices = getParserServices(context, true);
  const overrides =
    explicitOverrides ?? getImmutabilityOverrides(context.settings);

  if (!isParserServicesWithTypeInformation(parserServices)) {
    return Immutability.Unknown;
  }

  const tsNode = parserServices.esTreeNodeToTSNodeMap.get(node);
  const typedNode = ts.isIdentifier(tsNode) ? tsNode.parent : tsNode;
  const typeLike =
    (typedNode as { type?: TypeNode }).type ??
    getTypeOfNode(parserServices.tsNodeToESTreeNodeMap.get(typedNode), context);
  assert(typeLike !== null);

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
  const parserServices = getParserServices(context, true);
  const overrides =
    explicitOverrides ?? getImmutabilityOverrides(context.settings);

  if (!isParserServicesWithTypeInformation(parserServices)) {
    return Immutability.Unknown;
  }

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
  const parserServices = getParserServices(context, true);
  return parserServices.tsNodeToESTreeNodeMap.get(node);
}

/**
 * Does the given parser services have type information.
 */
export function isParserServicesWithTypeInformation(
  parserServices: ParserServices,
): parserServices is ParserServicesWithTypeInformation {
  return "getTypeAtLocation" in parserServices;
}
