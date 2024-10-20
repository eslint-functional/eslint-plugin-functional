import type { FlatConfig } from "@typescript-eslint/utils/ts-eslint";

export default {
  "prefer-const": "error",
  "no-param-reassign": "error",
  "no-var": "error",
} satisfies FlatConfig.Config["rules"] as NonNullable<FlatConfig.Config["rules"]>;
