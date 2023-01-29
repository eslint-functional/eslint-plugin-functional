import type { TSESLint, TSESTree } from "@typescript-eslint/utils";
import type { JSONSchema4 } from "json-schema";

import { createRule } from "~/utils/rule";
import type { RuleResult, NamedCreateRuleMetaWithCategory } from "~/utils/rule";
import { getReadonly } from "~/utils/tree";
import {
  isDefined,
  isTSIndexSignature,
  isTSParameterProperty,
  isTSPropertySignature,
  isPropertyDefinition,
  isTSTypeReference,
} from "~/utils/type-guards";

/**
 * The name of this rule.
 */
export const name = "readonly-type" as const;

/**
 * The options this rule can take.
 */
type Options = ["generic" | "keyword"];

/**
 * The schema for the rule options.
 */
const schema: JSONSchema4 = [
  {
    type: "string",
    enum: ["generic", "keyword"],
    additionalProperties: false,
  },
];

/**
 * The default options for the rule.
 */
const defaultOptions: Options = ["generic"];

/**
 * The possible error messages.
 */
const errorMessages = {
  generic:
    "Readonly type using 'readonly' keyword is forbidden. Use 'Readonly<T>' instead.",
  keyword:
    "Readonly type using 'Readonly<T>' is forbidden. Use 'readonly' keyword instead.",
} as const;

/**
 * The meta data for this rule.
 */
const meta: NamedCreateRuleMetaWithCategory<keyof typeof errorMessages> = {
  type: "suggestion",
  docs: {
    category: "Stylistic",
    description:
      "Require consistently using either `readonly` keywords or `Readonly<T>`",
    recommended: "error",
  },
  fixable: "code",
  messages: errorMessages,
  schema,
};

function checkTypeLiteral(
  node: TSESTree.TSTypeLiteral,
  context: TSESLint.RuleContext<keyof typeof errorMessages, Options>,
  options: Options
): RuleResult<keyof typeof errorMessages, Options> {
  const [mode] = options;
  const readonlyWrapper = getReadonly(node);
  const sourceCode = context.getSourceCode();

  if (readonlyWrapper !== null) {
    if (mode === "generic") {
      return {
        context,
        descriptors: node.members
          .map(
            (
              member
            ):
              | TSESLint.ReportDescriptor<keyof typeof errorMessages>
              | undefined => {
              if (
                (isPropertyDefinition(member) ||
                  isTSParameterProperty(member) ||
                  isTSPropertySignature(member)) &&
                member.readonly === true
              ) {
                return {
                  node: member.key,
                  messageId: "generic",
                  fix: (fixer) =>
                    fixer.replaceText(
                      member,
                      sourceCode.getText(member).replace(/readonly /u, "")
                    ),
                };
              }

              return undefined;
            }
          )
          .filter(isDefined),
      };
    }

    return {
      context,
      descriptors: [
        {
          node: isTSTypeReference(readonlyWrapper)
            ? readonlyWrapper.typeName
            : readonlyWrapper,
          messageId: "keyword",
          fix: (fixer) => {
            const text = sourceCode.getText(readonlyWrapper);

            const wrapperStartPattern = /^Readonly\s*</gu;
            const wrapperEndPattern = /\s*>$/gu;

            const start = wrapperStartPattern.exec(text);
            const end = wrapperEndPattern.exec(text);

            const startCutPoint = wrapperStartPattern.lastIndex;
            const endCutPoint = end!.index;

            return [
              fixer.removeRange([
                readonlyWrapper.range[0],
                readonlyWrapper.range[0] + startCutPoint,
              ]),
              fixer.removeRange([
                readonlyWrapper.range[1] - text.length + endCutPoint,
                readonlyWrapper.range[1],
              ]),
              ...node.members
                .map((member) => {
                  if (
                    !(
                      isPropertyDefinition(member) ||
                      isTSIndexSignature(member) ||
                      isTSParameterProperty(member) ||
                      isTSPropertySignature(member)
                    ) ||
                    member.readonly === true
                  ) {
                    return undefined;
                  }
                  return fixer.insertTextBefore(member, "readonly ");
                })
                .filter(isDefined),
            ];
          },
        },
      ],
    };
  }

  if (mode === "generic") {
    const needsWrapping = node.members.every(
      (member) =>
        (isPropertyDefinition(member) ||
          isTSIndexSignature(member) ||
          isTSParameterProperty(member) ||
          isTSPropertySignature(member)) &&
        member.readonly === true
    );

    if (needsWrapping) {
      return {
        context,
        descriptors: [
          {
            node,
            messageId: "generic",
            fix: (fixer) => [
              fixer.insertTextBefore(node, "Readonly<"),
              fixer.insertTextAfter(node, ">"),
              ...node.members.map((member) =>
                fixer.replaceText(
                  member,
                  sourceCode.getText(member).replace(/readonly /u, "")
                )
              ),
            ],
          },
        ],
      };
    }
  }

  return {
    context,
    descriptors: [],
  };
}

// Create the rule.
export const rule = createRule<keyof typeof errorMessages, Options>(
  name,
  meta,
  defaultOptions,
  {
    TSTypeLiteral: checkTypeLiteral,
  }
);
