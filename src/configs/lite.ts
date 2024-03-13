import { type FlatConfig } from "@typescript-eslint/utils/ts-eslint";

import * as functionalParameters from "#eslint-plugin-functional/rules/functional-parameters";
import * as immutableData from "#eslint-plugin-functional/rules/immutable-data";
import * as noConditionalStatements from "#eslint-plugin-functional/rules/no-conditional-statements";
import * as noExpressionStatements from "#eslint-plugin-functional/rules/no-expression-statements";
import * as preferImmutableTypes from "#eslint-plugin-functional/rules/prefer-immutable-types";

import recommended from "./recommended";

const overrides = {
  [functionalParameters.fullName]: [
    "error",
    {
      enforceParameterCount: false,
    },
  ],
  [immutableData.fullName]: ["error", { ignoreClasses: "fieldsOnly" }],
  [noConditionalStatements.fullName]: "off",
  [noExpressionStatements.fullName]: "off",
  [preferImmutableTypes.fullName]: [
    "error",
    {
      enforcement: "None",
      ignoreInferredTypes: true,
      parameters: {
        enforcement: "ReadonlyShallow",
      },
    },
  ],
} satisfies FlatConfig.Config["rules"];

export default {
  ...recommended,
  ...overrides,
};
