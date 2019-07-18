import { ReportDescriptor } from "@typescript-eslint/experimental-utils/dist/ts-eslint";
import { TSESTree } from "@typescript-eslint/typescript-estree";
import { AST_NODE_TYPES } from "@typescript-eslint/typescript-estree/dist/ts-estree/ast-node-types";
import { JSONSchema4 } from "json-schema";

import {
  checkNode,
  createRule,
  RuleContext,
  RuleMetaData,
  RuleResult
} from "../util/rule";
import { isTSPropertySignature } from "../util/typeguard";

// The name of this rule.
export const name = "no-mixed-interface" as const;

// The options this rule can take.
type Options = {};

// The schema for the rule options.
const schema: JSONSchema4 = [];

// The default options for the rule.
const defaultOptions: Options = {};

// The possible error messages.
const errorMessages = {
  generic: "Only the same kind of members allowed in interfaces."
} as const;

// The meta data for this rule.
const meta: RuleMetaData<keyof typeof errorMessages> = {
  type: "suggestion",
  docs: {
    description:
      "Restrict interfaces so that only members of the same kind of are allowed in them.",
    category: "Best Practices",
    recommended: false
  },
  messages: errorMessages,
  schema
};

/**
 * Check if the given TSInterfaceDeclaration violates this rule.
 */
function checkTSInterfaceDeclaration(
  node: TSESTree.TSInterfaceDeclaration,
  context: RuleContext<keyof typeof errorMessages, Options>
): RuleResult<keyof typeof errorMessages, Options> {
  type CarryType = {
    readonly prevMemberType: AST_NODE_TYPES | undefined;
    readonly prevMemberTypeAnnotation: AST_NODE_TYPES | undefined;
    readonly violations: ReadonlyArray<
      ReportDescriptor<keyof typeof errorMessages>
    >;
  };

  return {
    context,
    descriptors: node.body.body.reduce<CarryType>(
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
    ).violations
  };
}

// Create the rule.
export const rule = createRule<keyof typeof errorMessages, Options>(
  name,
  meta,
  defaultOptions,
  (context, options) => {
    const _checkTSInterfaceDeclaration = checkNode(
      checkTSInterfaceDeclaration,
      context,
      options
    );

    return {
      TSInterfaceDeclaration: _checkTSInterfaceDeclaration
    };
  }
);
