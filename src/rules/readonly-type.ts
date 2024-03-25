import { type TSESTree } from "@typescript-eslint/utils";
import { type JSONSchema4 } from "@typescript-eslint/utils/json-schema";
import {
  type ReportDescriptor,
  type RuleContext,
} from "@typescript-eslint/utils/ts-eslint";

import { ruleNameScope } from "#eslint-plugin-functional/utils/misc";
import {
  createRule,
  type NamedCreateRuleCustomMeta,
  type RuleResult,
} from "#eslint-plugin-functional/utils/rule";
import { getReadonly } from "#eslint-plugin-functional/utils/tree";
import {
  isDefined,
  isPropertyDefinition,
  isTSIndexSignature,
  isTSParameterProperty,
  isTSPropertySignature,
  isTSTypeReference,
} from "#eslint-plugin-functional/utils/type-guards";

/**
 * The name of this rule.
 */
export const name = "readonly-type";

/**
 * The full name of this rule.
 */
export const fullName = `${ruleNameScope}/${name}`;

/**
 * The options this rule can take.
 */
type Options = ["generic" | "keyword"];

/**
 * The schema for the rule options.
 */
const schema: JSONSchema4[] = [
  {
    type: "string",
    enum: ["generic", "keyword"],
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
const meta: NamedCreateRuleCustomMeta<keyof typeof errorMessages, Options> = {
  type: "suggestion",
  docs: {
    category: "Stylistic",
    description:
      "Require consistently using either `readonly` keywords or `Readonly<T>`",
    recommended: "recommended",
    recommendedSeverity: "error",
    requiresTypeChecking: true,
  },
  fixable: "code",
  messages: errorMessages,
  schema,
};

/**
 * Check for violations with a type literal.
 */
function checkTypeLiteral(
  node: TSESTree.TSTypeLiteral,
  context: Readonly<RuleContext<keyof typeof errorMessages, Options>>,
  options: Options,
): RuleResult<keyof typeof errorMessages, Options> {
  const [mode] = options;
  const readonlyWrapper = getReadonly(node);
  const { sourceCode } = context;

  if (readonlyWrapper !== null) {
    if (mode === "generic") {
      return {
        context,
        descriptors: node.members
          .map(
            (
              member,
            ): ReportDescriptor<keyof typeof errorMessages> | undefined => {
              if (
                (isPropertyDefinition(member) ||
                  isTSParameterProperty(member) ||
                  isTSPropertySignature(member)) &&
                member.readonly
              ) {
                return {
                  node: member.key,
                  messageId: "generic",
                  fix: (fixer) =>
                    fixer.replaceText(
                      member,
                      sourceCode.getText(member).replace(/readonly /u, ""),
                    ),
                };
              }

              return undefined;
            },
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

            // eslint-disable-next-line functional/no-expression-statements -- Sets `wrapperStartPattern.lastIndex`.
            wrapperStartPattern.exec(text);
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
                    member.readonly
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
        member.readonly,
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
                  sourceCode.getText(member).replace(/readonly /u, ""),
                ),
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
  },
);
