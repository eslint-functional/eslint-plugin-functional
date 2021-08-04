import type { TSESTree } from "@typescript-eslint/experimental-utils";
import type { JSONSchema4 } from "json-schema";

import type { RuleContext, RuleMetaData, RuleResult } from "~/util/rule";
import { createRule, isReadonly } from "~/util/rule";

// The name of this rule.
export const name = "prefer-readonly-type-alias" as const;

const enum RequiredReadonlyness {
  READONLY,
  MUTABLE,
  EITHER,
}

// The options this rule can take.
type Options = {
  readonly mustBeReadonly: {
    readonly pattern: ReadonlyArray<string> | string;
    readonly requireOthersToBeMutable: boolean;
  };
  readonly mustBeMutable: {
    readonly pattern: ReadonlyArray<string> | string;
    readonly requireOthersToBeReadonly: boolean;
  };
  readonly blacklist: ReadonlyArray<string>;
};

// The schema for the rule options.
const schema: JSONSchema4 = [
  {
    type: "object",
    properties: {
      mustBeReadonly: {
        type: "object",
        properties: {
          pattern: {
            type: ["string", "array"],
            items: {
              type: "string",
            },
          },
          requireOthersToBeMutable: {
            type: "boolean",
          },
        },
        additionalProperties: false,
      },
      mustBeMutable: {
        type: "object",
        properties: {
          pattern: {
            type: ["string", "array"],
            items: {
              type: "string",
            },
          },
          requireOthersToBeReadonly: {
            type: "boolean",
          },
        },
        additionalProperties: false,
      },
      blacklist: {
        type: "array",
        items: {
          type: "string",
        },
      },
    },
    additionalProperties: false,
  },
];

// The default options for the rule.
const defaultOptions: Options = {
  mustBeReadonly: {
    pattern: "^Readonly",
    requireOthersToBeMutable: false,
  },
  mustBeMutable: {
    pattern: "^Mutable",
    requireOthersToBeReadonly: true,
  },
  blacklist: ["^Mutable$"],
};

// The possible error messages.
const errorMessages = {
  mutable: "Mutable types should not be fully readonly.",
  readonly: "Readonly types should not be mutable at all.",
  mutableReadonly:
    "Configuration error - this type must be marked as both readonly and mutable.",
  needsExplicitMarking:
    "Type must be explicity marked as either readonly or mutable.",
} as const;

// The meta data for this rule.
const meta: RuleMetaData<keyof typeof errorMessages> = {
  type: "suggestion",
  docs: {
    description: "Prefer readonly type alias over mutable one.",
    category: "Best Practices",
    recommended: "error",
  },
  messages: errorMessages,
  fixable: "code",
  schema,
};

/**
 * Check if the given TypeReference violates this rule.
 */
function checkTypeAliasDeclaration(
  node: TSESTree.TSTypeAliasDeclaration,
  context: RuleContext<keyof typeof errorMessages, Options>,
  options: Options
): RuleResult<keyof typeof errorMessages, Options> {
  const blacklistPatterns = (
    Array.isArray(options.blacklist) ? options.blacklist : [options.blacklist]
  ).map((pattern) => new RegExp(pattern, "u"));

  const blacklisted = blacklistPatterns.some((pattern) =>
    pattern.test(node.id.name)
  );

  if (blacklisted) {
    return {
      context,
      descriptors: [],
    };
  }

  const mustBeReadonlyPatterns = (
    Array.isArray(options.mustBeReadonly.pattern)
      ? options.mustBeReadonly.pattern
      : [options.mustBeReadonly.pattern]
  ).map((pattern) => new RegExp(pattern, "u"));

  const mustBeMutablePatterns = (
    Array.isArray(options.mustBeMutable.pattern)
      ? options.mustBeMutable.pattern
      : [options.mustBeMutable.pattern]
  ).map((pattern) => new RegExp(pattern, "u"));

  const patternStatesReadonly = mustBeReadonlyPatterns.some((pattern) =>
    pattern.test(node.id.name)
  );
  const patternStatesMutable = mustBeMutablePatterns.some((pattern) =>
    pattern.test(node.id.name)
  );

  if (patternStatesReadonly && patternStatesMutable) {
    return {
      context,
      descriptors: [
        {
          node: node.id,
          messageId: "mutableReadonly",
        },
      ],
    };
  }

  if (
    !patternStatesReadonly &&
    !patternStatesMutable &&
    options.mustBeReadonly.requireOthersToBeMutable &&
    options.mustBeMutable.requireOthersToBeReadonly
  ) {
    return {
      context,
      descriptors: [
        {
          node: node.id,
          messageId: "needsExplicitMarking",
        },
      ],
    };
  }

  const requiredReadonlyness =
    patternStatesReadonly ||
    (!patternStatesMutable && options.mustBeMutable.requireOthersToBeReadonly)
      ? RequiredReadonlyness.READONLY
      : patternStatesMutable ||
        (!patternStatesReadonly &&
          options.mustBeReadonly.requireOthersToBeMutable)
      ? RequiredReadonlyness.MUTABLE
      : RequiredReadonlyness.EITHER;

  return checkRequiredReadonlyness(
    node,
    context,
    options,
    requiredReadonlyness
  );
}

function checkRequiredReadonlyness(
  node: TSESTree.TSTypeAliasDeclaration,
  context: RuleContext<keyof typeof errorMessages, Options>,
  options: Options,
  requiredReadonlyness: RequiredReadonlyness
): RuleResult<keyof typeof errorMessages, Options> {
  if (requiredReadonlyness !== RequiredReadonlyness.EITHER) {
    const readonly = isReadonly(node.typeAnnotation, context);

    if (readonly && requiredReadonlyness === RequiredReadonlyness.MUTABLE) {
      return {
        context,
        descriptors: [
          {
            node: node.id,
            messageId: "readonly",
          },
        ],
      };
    }

    if (!readonly && requiredReadonlyness === RequiredReadonlyness.READONLY) {
      return {
        context,
        descriptors: [
          {
            node: node.id,
            messageId: "mutable",
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
    TSTypeAliasDeclaration: checkTypeAliasDeclaration,
  }
);
