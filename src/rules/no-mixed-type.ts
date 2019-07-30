import {
  AST_NODE_TYPES,
  TSESLint,
  TSESTree
} from "@typescript-eslint/experimental-utils";
import { JSONSchema4 } from "json-schema";

import {
  createRule,
  RuleContext,
  RuleMetaData,
  RuleResult
} from "../util/rule";
import { isTSPropertySignature, isTSTypeLiteral } from "../util/typeguard";

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
        type: "boolean"
      },
      checkTypeLiterals: {
        type: "boolean"
      }
    },
    additionalProperties: false
  }
];

// The default options for the rule.
const defaultOptions: Options = {
  checkInterfaces: true,
  checkTypeLiterals: true
};

// The possible error messages.
const errorMessages = {
  generic: "Only the same kind of members allowed in types."
} as const;

// The meta data for this rule.
const meta: RuleMetaData<keyof typeof errorMessages> = {
  type: "suggestion",
  docs: {
    description:
      "Restrict types so that only members of the same kind of are allowed in them.",
    category: "Best Practices",
    recommended: false
  },
  messages: errorMessages,
  schema
};

/**
 * Get the violations for the given type elements.
 */
function getTypeElementViolations(
  typeElements: ReadonlyArray<TSESTree.TypeElement>
): RuleResult<keyof typeof errorMessages, Options>["descriptors"] {
  type CarryType = {
    readonly prevMemberType: AST_NODE_TYPES | undefined;
    readonly prevMemberTypeAnnotation: AST_NODE_TYPES | undefined;
    readonly violations: ReadonlyArray<
      TSESLint.ReportDescriptor<keyof typeof errorMessages>
    >;
  };

  return typeElements.reduce<CarryType>(
    (carry, member) => {
      const memberType = member.type;
      const memberTypeAnnotation =
        isTSPropertySignature(member) && member.typeAnnotation !== undefined
          ? member.typeAnnotation.typeAnnotation.type
          : undefined;

      return {
        prevMemberType: memberType,
        prevMemberTypeAnnotation: memberTypeAnnotation,
        violations:
          // Not the first property in the interface.
          carry.prevMemberType !== undefined &&
          // And different property type to previous property.
          (carry.prevMemberType !== memberType ||
            // Or annotationed with a different type annotation.
            (carry.prevMemberTypeAnnotation !== memberTypeAnnotation &&
              // Where one of the properties is a annotationed as a function.
              (carry.prevMemberTypeAnnotation ===
                AST_NODE_TYPES.TSFunctionType ||
                memberTypeAnnotation === AST_NODE_TYPES.TSFunctionType)))
            ? [...carry.violations, { node: member, messageId: "generic" }]
            : carry.violations
      };
    },
    {
      prevMemberType: undefined,
      prevMemberTypeAnnotation: undefined,
      violations: []
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
    descriptors: options.checkInterfaces
      ? getTypeElementViolations(node.body.body)
      : []
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
      options.checkTypeLiterals && isTSTypeLiteral(node.typeAnnotation)
        ? getTypeElementViolations(node.typeAnnotation.members)
        : []
  };
}

// Create the rule.
export const rule = createRule<keyof typeof errorMessages, Options>(
  name,
  meta,
  defaultOptions,
  {
    TSInterfaceDeclaration: checkTSInterfaceDeclaration,
    TSTypeAliasDeclaration: checkTSTypeAliasDeclaration
  }
);
