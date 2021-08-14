import type { TSESTree } from "@typescript-eslint/experimental-utils";
import { AST_NODE_TYPES } from "@typescript-eslint/experimental-utils";
import type { JSONSchema4 } from "json-schema";

import type { RuleContext, RuleMetaData, RuleResult } from "~/util/rule";
import { createRule } from "~/util/rule";
import { isTSPropertySignature, isTSTypeLiteral } from "~/util/typeguard";

// The name of this rule.
export const name = "no-mixed-type" as const;

// The options this rule can take.
type Options = {
  readonly checkInterfaces: boolean;
  readonly checkTypeLiterals: boolean;
};

// The schema for the rule options.
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

// The default options for the rule.
const defaultOptions: Options = {
  checkInterfaces: true,
  checkTypeLiterals: true,
};

// The possible error messages.
const errorMessages = {
  generic: "Only the same kind of members allowed in types.",
} as const;

// The meta data for this rule.
const meta: RuleMetaData<keyof typeof errorMessages> = {
  type: "suggestion",
  docs: {
    description:
      "Restrict types so that only members of the same kind of are allowed in them.",
    category: "Best Practices",
    recommended: "error",
  },
  messages: errorMessages,
  schema,
};

/**
 * Does the given type elements violate the rule.
 */
function hasTypeElementViolations(
  typeElements: ReadonlyArray<TSESTree.TypeElement>
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
  node: TSESTree.TSInterfaceDeclaration,
  context: RuleContext<keyof typeof errorMessages, Options>,
  options: Options
): RuleResult<keyof typeof errorMessages, Options> {
  return {
    context,
    descriptors:
      options.checkInterfaces && hasTypeElementViolations(node.body.body)
        ? [{ node, messageId: "generic" }]
        : [],
  };
}

/**
 * Check if the given TSTypeAliasDeclaration violates this rule.
 */
function checkTSTypeAliasDeclaration(
  node: TSESTree.TSTypeAliasDeclaration,
  context: RuleContext<keyof typeof errorMessages, Options>,
  options: Options
): RuleResult<keyof typeof errorMessages, Options> {
  return {
    context,
    descriptors:
      options.checkTypeLiterals &&
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
