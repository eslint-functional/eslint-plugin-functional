import { TSESTree } from "@typescript-eslint/typescript-estree";
import escapeRegExp from "escape-string-regexp";
import { JSONSchema4 } from "json-schema";

import { BaseOptions, RuleContext } from "../util/rule";
import { inClass, inFunction, inInterface } from "../util/tree";
import {
  isCallExpression,
  isExpressionStatement,
  isIdentifier,
  isTSPropertySignature,
  isTypeAliasDeclaration,
  isVariableDeclaration,
  isVariableDeclarator
} from "../util/typeguard";

export type AllIgnoreOptions = IgnoreLocalOption &
  IgnorePatternOptions &
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

export interface IgnorePatternOptions {
  readonly ignorePattern?: string | Array<string>;
  readonly ignorePrefix?: string | Array<string>;
  readonly ignoreSuffix?: string | Array<string>;
}

export const ignorePatternOptionsSchema: JSONSchema4 = {
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
 * Should the given node be ignored?
 */
export function shouldIgnore(
  node: TSESTree.Node,
  context: RuleContext<string, BaseOptions>,
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

  const identifiers: ReadonlyArray<string> = (isVariableDeclaration(node)
    ? node.declarations.map(declaration =>
        isIdentifier(declaration.id) ? declaration.id.name : undefined
      )
    : isVariableDeclarator(node) || isTypeAliasDeclaration(node)
    ? isIdentifier(node.id)
      ? [node.id.name]
      : []
    : isExpressionStatement(node)
    ? isCallExpression(node.expression)
      ? [context.getSourceCode().getText(node.expression.callee)]
      : []
    : isTSPropertySignature(node)
    ? isIdentifier(node.key)
      ? [node.key.name]
      : []
    : []
  ).filter(name => name !== undefined) as ReadonlyArray<string>;

  if (
    identifiers.length > 0 &&
    identifiers.every(identifier => {
      // Ignore if ignore-pattern is set and the pattern matches.
      if (
        ignoreOptions.ignorePattern &&
        isIgnoredPattern(identifier, ignoreOptions.ignorePattern)
      ) {
        return true;
      }

      // Ignore if ignore-prefix is set and the prefix matches.
      if (
        ignoreOptions.ignorePrefix &&
        isIgnoredPrefix(identifier, ignoreOptions.ignorePrefix)
      ) {
        return true;
      }

      // Ignore if ignore-suffix is set and the suffix matches.
      if (
        ignoreOptions.ignoreSuffix &&
        isIgnoredSuffix(identifier, ignoreOptions.ignoreSuffix)
      ) {
        return true;
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

  // One or more patterns match?
  return patterns.some(pattern =>
    findMatch(pattern.split("."), text.split("."))
  );
}

function findMatch(
  patternParts: ReadonlyArray<string>,
  textParts: ReadonlyArray<string>
): boolean {
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
}
