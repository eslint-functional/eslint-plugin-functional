import type { TSESTree } from "@typescript-eslint/utils";
import type { JSONSchema4 } from "@typescript-eslint/utils/json-schema";
import type { RuleContext } from "@typescript-eslint/utils/ts-eslint";

import { ruleNameScope } from "#/utils/misc";
import {
  type NamedCreateRuleCustomMeta,
  type Rule,
  type RuleResult,
  createRuleUsingFunction,
  getTypeOfNode,
} from "#/utils/rule";
import {
  isFunctionLikeType,
  isIdentifier,
  isTSCallSignatureDeclaration,
  isTSConstructSignatureDeclaration,
  isTSFunctionType,
  isTSIndexSignature,
  isTSMethodSignature,
  isTSPropertySignature,
  isTSTypeLiteral,
  isTSTypeReference,
} from "#/utils/type-guards";

/**
 * The name of this rule.
 */
export const name = "no-mixed-types";

/**
 * The full name of this rule.
 */
export const fullName: `${typeof ruleNameScope}/${typeof name}` = `${ruleNameScope}/${name}`;

/**
 * The options this rule can take.
 */
type Options = [
  {
    checkInterfaces: boolean;
    checkTypeLiterals: boolean;
  },
];

/**
 * The schema for the rule options.
 */
const schema: JSONSchema4[] = [
  {
    type: "object",
    properties: {
      checkInterfaces: {
        type: "boolean",
      },
      checkTypeLiterals: {
        type: "boolean",
      },
    },
    additionalProperties: false,
  },
];

/**
 * The default options for the rule.
 */
const defaultOptions: Options = [
  {
    checkInterfaces: true,
    checkTypeLiterals: true,
  },
];

/**
 * The possible error messages.
 */
const errorMessages = {
  generic: "Only the same kind of members allowed in types.",
} as const;

/**
 * The meta data for this rule.
 */
const meta: NamedCreateRuleCustomMeta<keyof typeof errorMessages> = {
  type: "suggestion",
  docs: {
    category: "No Other Paradigms",
    description: "Restrict types so that only members of the same kind are allowed in them.",
    recommended: "recommended",
    recommendedSeverity: "error",
    requiresTypeChecking: true,
  },
  messages: errorMessages,
  schema,
};

/**
 * Does the given type elements violate the rule.
 */
function hasTypeElementViolations(
  typeElements: ReadonlyArray<TSESTree.TypeElement>,
  context: Readonly<RuleContext<keyof typeof errorMessages, Options>>,
): boolean {
  return !typeElements
    .map(
      (member) =>
        isTSMethodSignature(member) ||
        isTSCallSignatureDeclaration(member) ||
        isTSConstructSignatureDeclaration(member) ||
        ((isTSPropertySignature(member) || isTSIndexSignature(member)) &&
          member.typeAnnotation !== undefined &&
          (isTSFunctionType(member.typeAnnotation.typeAnnotation) ||
            isFunctionLikeType(getTypeOfNode(member, context)))),
    )
    .every((isFunction, _, array) => array[0] === isFunction);
}

/**
 * Check if the given TSInterfaceDeclaration violates this rule.
 */
function checkTSInterfaceDeclaration(
  node: TSESTree.TSInterfaceDeclaration,
  context: Readonly<RuleContext<keyof typeof errorMessages, Options>>,
  options: Readonly<Options>,
): RuleResult<keyof typeof errorMessages, Options> {
  return {
    context,
    descriptors: hasTypeElementViolations(node.body.body, context) ? [{ node, messageId: "generic" }] : [],
  };
}

/**
 * Check if the given TSTypeAliasDeclaration violates this rule.
 */
function checkTSTypeAliasDeclaration(
  node: TSESTree.TSTypeAliasDeclaration,
  context: Readonly<RuleContext<keyof typeof errorMessages, Options>>,
  options: Readonly<Options>,
): RuleResult<keyof typeof errorMessages, Options> {
  return {
    context,
    descriptors:
      // TypeLiteral.
      (isTSTypeLiteral(node.typeAnnotation) && hasTypeElementViolations(node.typeAnnotation.members, context)) ||
      // TypeLiteral inside `Readonly<>`.
      (isTSTypeReference(node.typeAnnotation) &&
        isIdentifier(node.typeAnnotation.typeName) &&
        node.typeAnnotation.typeArguments !== undefined &&
        node.typeAnnotation.typeArguments.params.length === 1 &&
        isTSTypeLiteral(node.typeAnnotation.typeArguments.params[0]!) &&
        hasTypeElementViolations(node.typeAnnotation.typeArguments.params[0].members, context))
        ? [{ node, messageId: "generic" }]
        : [],
  };
}

// Create the rule.
export const rule: Rule<keyof typeof errorMessages, Options> = createRuleUsingFunction<
  keyof typeof errorMessages,
  Options
>(name, meta, defaultOptions, (context, options) => {
  const [{ checkInterfaces, checkTypeLiterals }] = options;

  return Object.fromEntries(
    (
      [
        ["TSInterfaceDeclaration", checkInterfaces ? checkTSInterfaceDeclaration : undefined],
        ["TSTypeAliasDeclaration", checkTypeLiterals ? checkTSTypeAliasDeclaration : undefined],
      ] as const
    ).filter(([sel, fn]) => fn !== undefined),
  ) as Record<string, any>;
});
