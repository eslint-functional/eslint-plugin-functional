import { type TSESTree } from "@typescript-eslint/utils";
import { type RuleContext } from "@typescript-eslint/utils/ts-eslint";
import typeMatchesSpecifier, {
  type TypeDeclarationSpecifier,
} from "ts-declaration-location";

import { getTypeOfNode } from "../utils/rule";

/**
 * Options that can be overridden.
 */
export type OverridableOptions<CoreOptions> = CoreOptions & {
  overrides?: Array<
    {
      specifiers: TypeDeclarationSpecifier | TypeDeclarationSpecifier[];
    } & (
      | {
          options: CoreOptions;
          disable?: false;
        }
      | {
          disable: true;
        }
    )
  >;
};

/**
 * Get the core options to use, taking into account overrides.
 *
 * @throws when there is a configuration error.
 */
export function getCoreOptions<
  CoreOptions extends object,
  Options extends readonly [Readonly<OverridableOptions<CoreOptions>>],
>(
  node: TSESTree.Node,
  context: Readonly<RuleContext<string, Options>>,
  options: Readonly<Options>,
): CoreOptions | null {
  const [optionsObject] = options;

  const program = context.sourceCode.parserServices?.program ?? undefined;
  if (program === undefined) {
    return optionsObject;
  }

  const type = getTypeOfNode(node, context);
  const found = optionsObject.overrides?.find((override) =>
    (Array.isArray(override.specifiers)
      ? override.specifiers
      : [override.specifiers]
    ).some((specifier) => typeMatchesSpecifier(program, specifier, type)),
  );

  if (found !== undefined) {
    if (found.disable === true) {
      return null;
    }
    if (found.options === undefined) {
      // eslint-disable-next-line functional/no-throw-statements
      throw new Error("Configuration error: No options found for override.");
    }
    return found.options;
  }

  return optionsObject;
}
