import { TSESTree } from "@typescript-eslint/typescript-estree";
import { all as deepMerge } from "deepmerge";
import { JSONSchema4 } from "json-schema";

import * as ignore from "../common/ignore-options";
import {
  checkNode,
  createRule,
  RuleContext,
  RuleMetaData,
  RuleResult
} from "../util/rule";
import { isIdentifier } from "../util/typeguard";

// The name of this rule.
export const name = "prefer-type" as const;

// The options this rule can take.
type Options = ignore.IgnoreLocalOption & ignore.IgnorePatternOption;

// The schema for the rule options.
const schema: JSONSchema4 = [
  deepMerge([ignore.ignoreLocalOptionSchema, ignore.ignorePatternOptionSchema])
];

// The default options for the rule.
const defaultOptions: Options = {};

// The possible error messages.
const errorMessages = {
  generic: "Unexpected interface, use a type literal instead."
} as const;

// The meta data for this rule.
const meta: RuleMetaData<keyof typeof errorMessages> = {
  type: "suggestion",
  docs: {
    description: "Prefer Type Literals over Interfaces.",
    category: "Best Practices",
    recommended: false
  },
  messages: errorMessages,
  fixable: "code",
  schema
};

/**
 * Check if the given interface node violates this rule.
 */
function checkInterface(
  node: TSESTree.TSInterfaceDeclaration,
  context: RuleContext<keyof typeof errorMessages, Options>
): RuleResult<keyof typeof errorMessages, Options> {
  return {
    context,
    descriptors: [
      {
        node,
        messageId: "generic",
        fix:
          node.extends === undefined ||
          node.extends.every(type => isIdentifier(type.expression))
            ? fixer => [
                fixer.replaceTextRange(
                  [node.range[0], node.range[0] + "interface".length],
                  "type"
                ),
                fixer.insertTextBefore(node.body, "= "),
                ...(node.extends === undefined
                  ? []
                  : [
                      fixer.replaceTextRange(
                        [node.id.range[1], node.body.range[0]],
                        " "
                      ),
                      ...node.extends.map(type =>
                        fixer.insertTextBefore(
                          node.body,
                          `${(type.expression as TSESTree.Identifier).name} & `
                        )
                      )
                    ]),
                fixer.insertTextAfter(node, ";")
              ]
            : undefined
      }
    ]
  };
}

// Create the rule.
export const rule = createRule<keyof typeof errorMessages, Options>(
  name,
  meta,
  defaultOptions,
  (context, options) => {
    const _checkInterface = checkNode(checkInterface, context, options);

    return {
      TSInterfaceDeclaration: _checkInterface
    };
  }
);
