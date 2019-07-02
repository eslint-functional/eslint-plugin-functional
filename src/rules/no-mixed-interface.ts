import { TSESTree } from "@typescript-eslint/typescript-estree";
import { AST_NODE_TYPES } from "@typescript-eslint/typescript-estree/dist/ts-estree/ast-node-types";

import { checkNode, createRule, RuleContext, RuleMetaData } from "../util/rule";
import { isTSPropertySignature } from "../util/typeguard";

// The name of this rule.
export const name = "no-mixed-interface" as const;

// The options this rule can take.
type Options = [];

// The default options for the rule.
const defaultOptions: Options = [];

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
  schema: []
};

/**
 * Check if the given TSInterfaceDeclaration violates this rule.
 */
function checkTSInterfaceDeclaration(
  node: TSESTree.TSInterfaceDeclaration,
  context: RuleContext<keyof typeof errorMessages, Options>
): void {
  let prevMemberType: AST_NODE_TYPES | undefined = undefined;
  let prevMemberTypeAnnotation: AST_NODE_TYPES | undefined = undefined;

  for (const member of node.body.body) {
    const memberType = member.type;
    const memberTypeAnnotation =
      isTSPropertySignature(member) && member.typeAnnotation !== undefined
        ? member.typeAnnotation.typeAnnotation.type
        : undefined;

    if (
      // Not the first property in the interface.
      prevMemberType !== undefined &&
      // And different property type to previous property.
      (prevMemberType !== memberType ||
        // Or annotationed with a different type annotation.
        (prevMemberTypeAnnotation !== memberTypeAnnotation &&
          // Where one of the properties is a annotationed as a function.
          (prevMemberTypeAnnotation === AST_NODE_TYPES.TSFunctionType ||
            memberTypeAnnotation === AST_NODE_TYPES.TSFunctionType)))
    ) {
      context.report({ node: member, messageId: "generic" });
    }

    prevMemberType = memberType;
    prevMemberTypeAnnotation = memberTypeAnnotation;
  }
}

// Create the rule.
export const rule = createRule<keyof typeof errorMessages, Options>({
  name,
  meta,
  defaultOptions,
  create(context, options) {
    const _checkTSInterfaceDeclaration = checkNode(
      checkTSInterfaceDeclaration,
      context,
      undefined,
      options
    );

    return {
      TSInterfaceDeclaration: _checkTSInterfaceDeclaration
    };
  }
});
