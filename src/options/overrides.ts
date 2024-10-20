import assert from "node:assert/strict";

import type { TSESTree } from "@typescript-eslint/utils";
import type { RuleContext } from "@typescript-eslint/utils/ts-eslint";
import { deepmerge } from "deepmerge-ts";
import typeMatchesSpecifier, { type TypeDeclarationSpecifier } from "ts-declaration-location";
import type { Program, Type, TypeNode } from "typescript";

import { getTypeDataOfNode } from "#/utils/rule";
import { type RawTypeSpecifier, type TypeSpecifier, typeMatchesPattern } from "#/utils/type-specifier";

/**
 * Options that can be overridden.
 */
export type OverridableOptions<CoreOptions> = CoreOptions & {
  overrides?: Array<
    {
      specifiers: TypeSpecifier | TypeSpecifier[];
    } & (
      | {
          options: CoreOptions;
          inherit?: boolean;
          disable?: false;
        }
      | {
          disable: true;
        }
    )
  >;
};

export type RawOverridableOptions<CoreOptions> = CoreOptions & {
  overrides?: Array<{
    specifiers?: RawTypeSpecifier | RawTypeSpecifier[];
    options?: CoreOptions;
    inherit?: boolean;
    disable?: boolean;
  }>;
};

export function upgradeRawOverridableOptions<CoreOptions>(
  raw: Readonly<RawOverridableOptions<CoreOptions>>,
): OverridableOptions<CoreOptions> {
  return {
    ...raw,
    overrides:
      raw.overrides?.map((override) => ({
        ...override,
        specifiers:
          override.specifiers === undefined
            ? []
            : Array.isArray(override.specifiers)
              ? override.specifiers.map(upgradeRawTypeSpecifier)
              : [upgradeRawTypeSpecifier(override.specifiers)],
      })) ?? [],
  } as OverridableOptions<CoreOptions>;
}

function upgradeRawTypeSpecifier(raw: RawTypeSpecifier): TypeSpecifier {
  const { ignoreName, ignorePattern, name, pattern, ...rest } = raw;

  const names = name === undefined ? [] : Array.isArray(name) ? name : [name];

  const patterns = (pattern === undefined ? [] : Array.isArray(pattern) ? pattern : [pattern]).map(
    (p) => new RegExp(p, "u"),
  );

  const ignoreNames = ignoreName === undefined ? [] : Array.isArray(ignoreName) ? ignoreName : [ignoreName];

  const ignorePatterns = (
    ignorePattern === undefined ? [] : Array.isArray(ignorePattern) ? ignorePattern : [ignorePattern]
  ).map((p) => new RegExp(p, "u"));

  const include = [...names, ...patterns];
  const exclude = [...ignoreNames, ...ignorePatterns];

  return {
    ...rest,
    include,
    exclude,
  };
}

/**
 * Get the core options to use, taking into account overrides.
 */
export function getCoreOptions<CoreOptions extends object, Options extends Readonly<OverridableOptions<CoreOptions>>>(
  node: TSESTree.Node,
  context: Readonly<RuleContext<string, unknown[]>>,
  options: Readonly<Options>,
): CoreOptions | null {
  const program = context.sourceCode.parserServices?.program ?? undefined;
  if (program === undefined) {
    return options;
  }

  const [type, typeNode] = getTypeDataOfNode(node, context);
  return getCoreOptionsForType(type, typeNode, context, options);
}

export function getCoreOptionsForType<
  CoreOptions extends object,
  Options extends Readonly<OverridableOptions<CoreOptions>>,
>(
  type: Type,
  typeNode: TypeNode | null,
  context: Readonly<RuleContext<string, unknown[]>>,
  options: Readonly<Options>,
): CoreOptions | null {
  const program = context.sourceCode.parserServices?.program ?? undefined;
  if (program === undefined) {
    return options;
  }

  const found = options.overrides?.find((override) =>
    (Array.isArray(override.specifiers) ? override.specifiers : [override.specifiers]).some(
      (specifier) =>
        typeMatchesSpecifierDeep(program, specifier, type) &&
        (specifier.include === undefined ||
          specifier.include.length === 0 ||
          typeMatchesPattern(program, type, typeNode, specifier.include, specifier.exclude)),
    ),
  );

  if (found !== undefined) {
    if (found.disable === true) {
      return null;
    }
    if (found.inherit !== false) {
      return deepmerge(options, found.options) as CoreOptions;
    }
    return found.options;
  }

  return options;
}

function typeMatchesSpecifierDeep(program: Program, specifier: TypeDeclarationSpecifier, type: Type) {
  const mut_stack = [type];
  // eslint-disable-next-line functional/no-loop-statements -- best to do this iteratively.
  while (mut_stack.length > 0) {
    const t = mut_stack.pop() ?? assert.fail();

    if (typeMatchesSpecifier(program, specifier, t)) {
      return true;
    }

    if (t.aliasTypeArguments !== undefined) {
      mut_stack.push(...t.aliasTypeArguments);
    }
  }

  return false;
}
