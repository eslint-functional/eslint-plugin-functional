import type { FlatConfig } from "@typescript-eslint/utils/ts-eslint";

import { rules } from "#/rules";
import { ruleNameScope } from "#/utils/misc";

export default {
  ...Object.fromEntries(
    Object.entries(rules)
      .filter(([, rule]) => rule.meta.deprecated !== true)
      .map(([name, rule]) => [`${ruleNameScope}/${name}`, rule.meta.docs.recommendedSeverity]),
  ),
} satisfies FlatConfig.Config["rules"] as NonNullable<FlatConfig.Config["rules"]>;
