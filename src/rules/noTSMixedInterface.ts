import { TSESTree } from "@typescript-eslint/typescript-estree";
import { AST_NODE_TYPES } from "@typescript-eslint/typescript-estree/dist/ts-estree/ast-node-types";

import { createRule, RuleContext, RuleMetaData } from "../util/rule";
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
  context: RuleContext<Options, keyof typeof errorMessages>
) {
  return (node: TSESTree.TSInterfaceDeclaration) => {
    let prevMemberType: AST_NODE_TYPES | undefined = undefined;
    let prevMemberTypeAnnotation: AST_NODE_TYPES | undefined = undefined;

    for (const member of node.body.body) {
      const memberType = member.type;
      const memberTypeAnnotation =
        isTSPropertySignature(member) && member.typeAnnotation !== undefined
          ? member.typeAnnotation.typeAnnotation.type
          : undefined;

      if (
        prevMemberType !== undefined &&
        (prevMemberType !== memberType ||
          prevMemberTypeAnnotation !== memberTypeAnnotation)
      ) {
        context.report({ node, messageId: "generic" });
      }

      prevMemberType = memberType;
      prevMemberTypeAnnotation = memberTypeAnnotation;
    }
  };
}

// Create the rule.
export const rule = createRule<Options, keyof typeof errorMessages>({
  name,
  meta,
  defaultOptions,
  create(context) {
    const _checkTSInterfaceDeclaration = checkTSInterfaceDeclaration(context);

    return {
      TSInterfaceDeclaration: _checkTSInterfaceDeclaration
    };
  }
});
