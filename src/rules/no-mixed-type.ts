import type { ESLintUtils, TSESLint, TSESTree } from "@typescript-eslint/utils";
import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import type { JSONSchema4 } from "json-schema";
import type { ReadonlyDeep } from "type-fest";

import type { RuleResult } from "~/util/rule";
import { createRule } from "~/util/rule";
import { isTSPropertySignature, isTSTypeLiteral } from "~/util/typeguard";

/**
 * The name of this rule.
 */
export const name = "no-mixed-type" as const;

/**
 * The options this rule can take.
 */
type Options = readonly [
  Readonly<{
    checkInterfaces: boolean;
    checkTypeLiterals: boolean;
  }>
];

/**
 * The schema for the rule options.
 */
const schema: JSONSchema4 = [
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
const meta: ESLintUtils.NamedCreateRuleMeta<keyof typeof errorMessages> = {
  type: "suggestion",
  docs: {
    description:
      "Restrict types so that only members of the same kind of are allowed in them.",
    recommended: "error",
  },
  messages: errorMessages,
  schema,
};

/**
 * Does the given type elements violate the rule.
 */
function hasTypeElementViolations(
  typeElements: ReadonlyArray<ReadonlyDeep<TSESTree.TypeElement>>
): boolean {
  type CarryType = {
    readonly prevMemberType: AST_NODE_TYPES | undefined;
    readonly prevMemberTypeAnnotation: AST_NODE_TYPES | undefined;
    readonly violations: boolean;
  };

  const typeElementsTypeInfo = typeElements.map((member) => ({
    type: member.type,
    typeAnnotation:
      isTSPropertySignature(member) && member.typeAnnotation !== undefined
        ? member.typeAnnotation.typeAnnotation.type
        : undefined,
  }));

  return typeElementsTypeInfo.reduce<CarryType>(
    (carry, member) => ({
      prevMemberType: member.type,
      prevMemberTypeAnnotation: member.typeAnnotation,
      violations:
        // Not the first property in the interface.
        carry.prevMemberType !== undefined &&
        // And different property type to previous property.
        (carry.prevMemberType !== member.type ||
          // Or annotated with a different type annotation.
          (carry.prevMemberTypeAnnotation !== member.typeAnnotation &&
            // Where one of the properties is a annotated as a function.
            (carry.prevMemberTypeAnnotation === AST_NODE_TYPES.TSFunctionType ||
              member.typeAnnotation === AST_NODE_TYPES.TSFunctionType))),
    }),
    {
      prevMemberType: undefined,
      prevMemberTypeAnnotation: undefined,
      violations: false,
    }
  ).violations;
}

/**
 * Check if the given TSInterfaceDeclaration violates this rule.
 */
function checkTSInterfaceDeclaration(
  node: ReadonlyDeep<TSESTree.TSInterfaceDeclaration>,
  context: ReadonlyDeep<
    TSESLint.RuleContext<keyof typeof errorMessages, Options>
  >,
  options: Options
): RuleResult<keyof typeof errorMessages, Options> {
  const [{ checkInterfaces }] = options;

  return {
    context,
    descriptors:
      checkInterfaces && hasTypeElementViolations(node.body.body)
        ? [{ node, messageId: "generic" }]
        : [],
  };
}

/**
 * Check if the given TSTypeAliasDeclaration violates this rule.
 */
function checkTSTypeAliasDeclaration(
  node: ReadonlyDeep<TSESTree.TSTypeAliasDeclaration>,
  context: ReadonlyDeep<
    TSESLint.RuleContext<keyof typeof errorMessages, Options>
  >,
  options: Options
): RuleResult<keyof typeof errorMessages, Options> {
  const [{ checkTypeLiterals }] = options;

  return {
    context,
    descriptors:
      checkTypeLiterals &&
      isTSTypeLiteral(node.typeAnnotation) &&
      hasTypeElementViolations(node.typeAnnotation.members)
        ? [{ node, messageId: "generic" }]
        : [],
  };
}

// Create the rule.
export const rule = createRule<keyof typeof errorMessages, Options>(
  name,
  meta,
  defaultOptions,
  {
    TSInterfaceDeclaration: checkTSInterfaceDeclaration,
    TSTypeAliasDeclaration: checkTSTypeAliasDeclaration,
  }
);
