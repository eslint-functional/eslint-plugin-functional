import { TSESTree } from "@typescript-eslint/typescript-estree";
import { JSONSchema4 } from "json-schema";

import * as ignore from "../common/ignore-options";
import {
  checkNode,
  createRule,
  getParserServices,
  parserServicesAvaliable,
  RuleContext,
  RuleMetaData,
  RuleResult
} from "../util/rule";
import { inConstructor } from "../util/tree";
import {
  isIdentifier,
  isMemberExpression,
  isObjectConstructorType
} from "../util/typeguard";

// The name of this rule.
export const name = "no-object-mutation" as const;

// The options this rule can take.
type Options = [ignore.IgnorePatternOptions];

// The schema for the rule options.
const schema: JSONSchema4 = [ignore.ignorePatternOptionsSchema];

// The default options for the rule.
const defaultOptions: Options = [{}];

// The possible error messages.
const errorMessages = {
  generic: "Modifying properties of existing object not allowed."
} as const;

// The meta data for this rule.
const meta: RuleMetaData<keyof typeof errorMessages> = {
  type: "suggestion",
  docs: {
    description: "Disallow mutating objects.",
    category: "Best Practices",
    recommended: "error"
  },
  messages: errorMessages,
  schema
};

/**
 * Check if the given assignment expression violates this rule.
 */
function checkAssignmentExpression(
  node: TSESTree.AssignmentExpression,
  context: RuleContext<keyof typeof errorMessages, Options>
): RuleResult<keyof typeof errorMessages, Options> {
  // No assignment with object.property on the left.
  if (
    isMemberExpression(node.left) &&
    // Ignore if in a constructor - allow for field initialization.
    !inConstructor(node)
  ) {
    return { context, descriptors: [{ node, messageId: "generic" }] };
  }
  return { context, descriptors: [] };
}

/**
 * Check if the given node violates this rule.
 */
function checkUnaryExpression(
  node: TSESTree.UnaryExpression,
  context: RuleContext<keyof typeof errorMessages, Options>
): RuleResult<keyof typeof errorMessages, Options> {
  // No deleting object properties.
  if (node.operator === "delete" && isMemberExpression(node.argument)) {
    return { context, descriptors: [{ node, messageId: "generic" }] };
  }
  return { context, descriptors: [] };
}

/**
 * Check if the given node violates this rule.
 */
function checkUpdateExpression(
  node: TSESTree.UpdateExpression,
  context: RuleContext<keyof typeof errorMessages, Options>
): RuleResult<keyof typeof errorMessages, Options> {
  if (
    (node.operator === "++" || node.operator === "--") &&
    isMemberExpression(node.argument)
  ) {
    return { context, descriptors: [{ node, messageId: "generic" }] };
  }
  return { context, descriptors: [] };
}

/**
 * Check if the given node violates this rule.
 */
function checkCallExpression(
  node: TSESTree.CallExpression,
  context: RuleContext<keyof typeof errorMessages, Options>
): RuleResult<keyof typeof errorMessages, Options> {
  // No Object.assign on identifiers.
  if (
    isMemberExpression(node.callee) &&
    isIdentifier(node.callee.property) &&
    node.callee.property.name === "assign" &&
    node.arguments.length >= 2 &&
    (isIdentifier(node.arguments[0]) || isMemberExpression(node.arguments[0]))
  ) {
    // Do type checking if avaliable.
    if (parserServicesAvaliable(context)) {
      const parserServices = getParserServices(context);
      if (
        isObjectConstructorType(
          parserServices.program
            .getTypeChecker()
            .getTypeAtLocation(
              parserServices.esTreeNodeToTSNodeMap.get(node.callee.object)
            )
        )
      ) {
        return { context, descriptors: [{ node, messageId: "generic" }] };
      }
    }
    // No type checking avaliable? Just assume "Object" is an ObjectConstructor
    // (and the only ObjectConstructor).
    else {
      if (
        isIdentifier(node.callee.object) &&
        node.callee.object.name === "Object"
      ) {
        return { context, descriptors: [{ node, messageId: "generic" }] };
      }
    }
  }
  return { context, descriptors: [] };
}

// Create the rule.
export const rule = createRule<keyof typeof errorMessages, Options>({
  name,
  meta,
  defaultOptions,
  create(context, [ignoreOptions, ...otherOptions]) {
    const _checkAssignmentExpression = checkNode(
      checkAssignmentExpression,
      context,
      ignoreOptions,
      otherOptions
    );
    const _checkUnaryExpression = checkNode(
      checkUnaryExpression,
      context,
      ignoreOptions,
      otherOptions
    );
    const _checkUpdateExpression = checkNode(
      checkUpdateExpression,
      context,
      ignoreOptions,
      otherOptions
    );
    // This functionality is only avaliable if the parser services are
    // avaliable.
    const _checkCallExpression = checkNode(
      checkCallExpression,
      context,
      ignoreOptions,
      otherOptions
    );

    return {
      AssignmentExpression: _checkAssignmentExpression,
      UnaryExpression: _checkUnaryExpression,
      UpdateExpression: _checkUpdateExpression,
      CallExpression: _checkCallExpression
    };
  }
});
