import { TSESTree } from "@typescript-eslint/typescript-estree";
import escapeRegExp from "escape-string-regexp";
import { JSONSchema4 } from "json-schema";

import { inClass, inFunction, inInterface } from "../util/tree";
import { BaseOptions, RuleContext } from "../util/rule";
import {
  isIdentifier,
  isTypeAliasDeclaration,
  isVariableDeclarator,
  isVariableDeclaration
} from "../util/typeguard";

type AllIgnoreOptions = IgnoreLocalOption &
  IgnoreOption &
  IgnoreRestParametersOption &
  IgnoreClassOption &
  IgnoreInterfaceOption &
  IgnoreNewArrayOption;

export type IgnoreLocalOption = {
  readonly ignoreLocal?: boolean;
};
export const ignoreLocalOptionSchema: JSONSchema4 = {
  type: "object",
  properties: {
    ignoreLocal: {
      type: "boolean"
    }
  },
  additionalProperties: false
};

export interface IgnoreOption {
  readonly ignorePattern?: string | Array<string>;
  readonly ignorePrefix?: string | Array<string>;
  readonly ignoreSuffix?: string | Array<string>;
}
export const ignoreOptionSchema: JSONSchema4 = {
  type: "object",
  properties: {
    ignorePattern: {
      type: ["string", "array"],
      items: {
        type: "string"
      }
    },
    ignorePrefix: {
      type: ["string", "array"],
      items: {
        type: "string"
      }
    },
    ignoreSuffix: {
      type: ["string", "array"],
      items: {
        type: "string"
      }
    }
  },
  additionalProperties: false
};

export interface IgnoreRestParametersOption {
  readonly ignoreRestParameters?: boolean;
}
export const ignoreRestParametersOptionSchema: JSONSchema4 = {
  type: "object",
  properties: {
    ignoreRestParameters: {
      type: "boolean"
    }
  },
  additionalProperties: false
};

export interface IgnoreReturnTypeOption {
  readonly ignoreReturnType?: boolean;
}
export const ignoreReturnTypeOptionSchema: JSONSchema4 = {
  type: "object",
  properties: {
    ignoreReturnType: {
      type: "boolean"
    }
  },
  additionalProperties: false
};

export interface IgnoreClassOption {
  readonly ignoreClass?: boolean;
}
export const ignoreClassOptionSchema: JSONSchema4 = {
  type: "object",
  properties: {
    ignoreClass: {
      type: "boolean"
    }
  },
  additionalProperties: false
};

export interface IgnoreInterfaceOption {
  readonly ignoreInterface?: boolean;
}
export const ignoreInterfaceOptionSchema: JSONSchema4 = {
  type: "object",
  properties: {
    ignoreInterface: {
      type: "boolean"
    }
  },
  additionalProperties: false
};

export interface IgnoreNewArrayOption {
  readonly ignoreNewArray?: boolean;
}
export const ignoreNewArrayOptionSchema: JSONSchema4 = {
  type: "object",
  properties: {
    ignoreNewArray: {
      type: "boolean"
    }
  },
  additionalProperties: false
};

/**
 * Check a node taking into account the ignore options.
 */
export function checkNodeWithIgnore<
  Context extends RuleContext<string, [IgnoreOptions]>,
  IgnoreOptions extends AllIgnoreOptions,
  Node extends TSESTree.Node
>(
  check: (node: Node, context: Context, options: BaseOptions) => void,
  context: Context,
  ignoreOptions: IgnoreOptions,
  otherOptions: BaseOptions
): (node: Node) => void {
  return (node: Node) => {
    if (shouldIgnore(node, ignoreOptions)) {
      return;
    }

    return check(node, context, [ignoreOptions, ...otherOptions]);
  };
}

/**
 * Should the given node be ignored?
 */
function shouldIgnore(
  node: TSESTree.Node,
  ignoreOptions: AllIgnoreOptions
): boolean {
  // Ignore if in a function and ignore-local is set.
  if (ignoreOptions.ignoreLocal && inFunction(node)) {
    return true;
  }

  // Ignore if in a class and ignore-class is set.
  if (ignoreOptions.ignoreClass && inClass(node)) {
    return true;
  }

  // Ignore if in an interface and ignore-interface is set.
  if (ignoreOptions.ignoreInterface && inInterface(node)) {
    return true;
  }

  const declarations = isVariableDeclaration(node)
    ? node.declarations
    : isVariableDeclarator(node) || isTypeAliasDeclaration(node)
    ? [node]
    : [];

  if (
    declarations.length > 0 &&
    declarations.every(declaration => {
      if (
        (isVariableDeclarator(declaration) ||
          isTypeAliasDeclaration(declaration)) &&
        isIdentifier(declaration.id)
      ) {
        const variableText = declaration.id.name;

        // Ignore if ignore-pattern is set and the pattern matches.
        if (
          ignoreOptions.ignorePattern &&
          isIgnoredPattern(variableText, ignoreOptions.ignorePattern)
        ) {
          return true;
        }

        // Ignore if ignore-prefix is set and the prefix matches.
        if (
          ignoreOptions.ignorePrefix &&
          isIgnoredPrefix(variableText, ignoreOptions.ignorePrefix)
        ) {
          return true;
        }

        // Ignore if ignore-suffix is set and the suffix matches.
        if (
          ignoreOptions.ignoreSuffix &&
          isIgnoredSuffix(variableText, ignoreOptions.ignoreSuffix)
        ) {
          return true;
        }
      }

      return false;
    })
  ) {
    return true;
  }

  return false;
}

function isIgnoredPrefix(
  text: string,
  ignorePrefix: Array<string> | string
): boolean {
  if (Array.isArray(ignorePrefix)) {
    if (ignorePrefix.find(pfx => text.indexOf(pfx) === 0)) {
      return true;
    }
  } else {
    if (text.indexOf(ignorePrefix) === 0) {
      return true;
    }
  }
  return false;
}

function isIgnoredSuffix(
  text: string,
  ignoreSuffix: Array<string> | string
): boolean {
  if (Array.isArray(ignoreSuffix)) {
    if (
      ignoreSuffix.find(sfx => {
        const indexToFindAt = text.length - sfx.length;
        return indexToFindAt >= 0 && text.indexOf(sfx) === indexToFindAt;
      })
    ) {
      return true;
    }
  } else {
    const indexToFindAt = text.length - ignoreSuffix.length;
    if (indexToFindAt >= 0 && text.indexOf(ignoreSuffix) === indexToFindAt) {
      return true;
    }
  }
  return false;
}

function isIgnoredPattern(
  text: string,
  ignorePattern: Array<string> | string
): boolean {
  const patterns = Array.isArray(ignorePattern)
    ? ignorePattern
    : [ignorePattern];

  const findMatch = (
    patternParts: ReadonlyArray<string>,
    textParts: ReadonlyArray<string>
  ): boolean => {
    let index = 0;
    for (; index < patternParts.length; index++) {
      // Out of text?
      if (index >= textParts.length) {
        return false;
      }

      switch (patternParts[index]) {
        // Match any depth (including 0)?
        case "**": {
          const subpattern = patternParts.slice(index + 1);
          for (let offset = index; offset < textParts.length; offset++) {
            const submatch = findMatch(subpattern, textParts.slice(offset));
            if (submatch) {
              return submatch;
            }
          }
          return false;
        }

        // Match anything?
        case "*":
          continue;

        default:
          break;
      }

      // textParts[i] matches patternParts[i]?
      if (
        new RegExp(
          "^" + escapeRegExp(patternParts[index]).replace(/\\\*/g, ".*") + "$"
        ).test(textParts[index])
      ) {
        continue;
      }

      // No Match.
      return false;
    }

    // Match.
    return textParts.length === index;
  };

  // One or more patterns match?
  return patterns.some(pattern =>
    findMatch(pattern.split("."), text.split("."))
  );
}
