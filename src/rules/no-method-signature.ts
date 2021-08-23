import { TSESTree } from "@typescript-eslint/experimental-utils";
import { JSONSchema4 } from "json-schema";

import {
  createRule,
  RuleContext,
  RuleMetaData,
  RuleResult,
} from "../util/rule";

// The name of this rule.
export const name = "no-method-signature" as const;

// The options this rule can take.
type Options = {};

// The schema for the rule options.
const schema: JSONSchema4 = [];

// The default options for the rule.
const defaultOptions: Options = {};

// The possible error messages.
const errorMessages = {
  generic:
    "Method signature is mutable, use property signature with readonly modifier instead.",
} as const;

// The meta data for this rule.
const meta: RuleMetaData<keyof typeof errorMessages> = {
  type: "suggestion",
  docs: {
    description:
      "Prefer property signatures with readonly modifiers over method signatures.",
    category: "Best Practices",
    recommended: "error",
  },
  messages: errorMessages,
  schema,
};

/**
 * Check if the given TSMethodSignature violates this rule.
 */
function checkTSMethodSignature(
  node: TSESTree.TSMethodSignature,
  context: RuleContext<keyof typeof errorMessages, Options>
): RuleResult<keyof typeof errorMessages, Options> {
  // All TS method signatures violate this rule.
  return { context, descriptors: [{ node, messageId: "generic" }] };
}

// Create the rule.
export const rule = createRule<keyof typeof errorMessages, Options>(
  name,
  meta,
  defaultOptions,
  {
    ':matches(TSInterfaceBody, TSTypeAliasDeclaration > TSIntersectionType > TSTypeLiteral, TSTypeAliasDeclaration > TSTypeLiteral, TSTypeAliasDeclaration > TSTypeReference:not([typeName.name="Readonly"]) > TSTypeParameterInstantiation > TSIntersectionType > TSTypeLiteral, TSTypeLiteral > TSPropertySignature > TSTypeAnnotation > TSTypeLiteral) > TSMethodSignature':
      checkTSMethodSignature,
  }
);
