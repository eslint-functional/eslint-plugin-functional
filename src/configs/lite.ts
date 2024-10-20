import type { FlatConfig } from "@typescript-eslint/utils/ts-eslint";

import * as functionalParameters from "#/rules/functional-parameters";
import * as immutableData from "#/rules/immutable-data";
import * as noClasses from "#/rules/no-classes";
import * as noConditionalStatements from "#/rules/no-conditional-statements";
import * as noExpressionStatements from "#/rules/no-expression-statements";
import * as preferImmutableTypes from "#/rules/prefer-immutable-types";

import recommended from "./recommended";

const overrides = {
  [functionalParameters.fullName]: [
    "error",
    {
      enforceParameterCount: false,
    },
  ],
  [immutableData.fullName]: ["error", { ignoreClasses: "fieldsOnly" }],
  [noClasses.fullName]: "off",
  [noConditionalStatements.fullName]: "off",
  [noExpressionStatements.fullName]: "off",
  [preferImmutableTypes.fullName]: [
    "error",
    {
      enforcement: "None",
      overrides: [
        {
          specifiers: {
            from: "file",
          },
          options: {
            ignoreInferredTypes: true,
            parameters: {
              enforcement: "ReadonlyShallow",
            },
          },
        },
      ],
    },
  ],
} satisfies FlatConfig.Config["rules"];

export default {
  ...recommended,
  ...overrides,
} satisfies FlatConfig.Config["rules"] as NonNullable<FlatConfig.Config["rules"]>;
