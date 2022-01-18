import type { ReadonlynessOptions } from "@typescript-eslint/type-utils";
import { isTypeReadonly } from "@typescript-eslint/type-utils";
import type { TSESLint, TSESTree } from "@typescript-eslint/utils";
import { ESLintUtils } from "@typescript-eslint/utils";
import type { Rule } from "eslint";
import type { ReadonlyDeep } from "type-fest";
import type { Node as TSNode, Type } from "typescript";

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
) {
  return ESLintUtils.RuleCreator(
    (ruleName) =>
      `https://github.com/jonaskello/eslint-plugin-functional/blob/v${__VERSION__}/docs/rules/${ruleName}.md`
  )({
    name,
    meta,
    defaultOptions,
    create: (context, options) =>
      Object.fromEntries(
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
      ),
  }) as unknown as Rule.RuleModule;
}

/**
 * Get the type of the the given node.
 */
export function getTypeOfNode<
  Context extends ReadonlyDeep<TSESLint.RuleContext<string, BaseOptions>>
>(node: ReadonlyDeep<TSESTree.Node>, context: Context): Type | null {
  const { parserServices } = context;

  if (
    parserServices === undefined ||
    parserServices.program === undefined ||
    parserServices.esTreeNodeToTSNodeMap === undefined
  ) {
    return null;
  }
  const checker = parserServices.program.getTypeChecker();
  const nodeType = checker.getTypeAtLocation(
    parserServices.esTreeNodeToTSNodeMap.get(node as TSESTree.Node)
  );
  const constrained = checker.getBaseConstraintOfType(nodeType);
  return constrained ?? nodeType;
}

/**
 * Is the given node readonly?
 */
export function isReadonly<
  Context extends ReadonlyDeep<TSESLint.RuleContext<string, BaseOptions>>
>(
  node: ReadonlyDeep<TSESTree.Node>,
  context: Context,
  readonlynessOptions: ReadonlyDeep<ReadonlynessOptions>
): boolean {
  const { parserServices } = context;

  if (parserServices === undefined || parserServices.program === undefined) {
    return false;
  }

  const checker = parserServices.program.getTypeChecker();
  const type = getTypeOfNode(node, context);
  return isTypeReadonly(checker, type!, readonlynessOptions);
}

/**
 * Get the es tree node from the given ts node.
 */
export function getESTreeNode<
  Context extends ReadonlyDeep<TSESLint.RuleContext<string, BaseOptions>>
>(
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- ignore TS Node
  node: TSNode,
  context: Context
): TSESTree.Node | null {
  const { parserServices } = context;

  return parserServices === undefined ||
    parserServices.program === undefined ||
    parserServices.tsNodeToESTreeNodeMap === undefined
    ? null
    : parserServices.tsNodeToESTreeNodeMap.get(node);
}
