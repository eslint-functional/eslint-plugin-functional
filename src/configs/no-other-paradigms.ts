import { type FlatConfig } from "@typescript-eslint/utils/ts-eslint";

import { rules } from "#eslint-plugin-functional/rules";
import { ruleNameScope } from "#eslint-plugin-functional/utils/misc";

export default Object.fromEntries(
  Object.entries(rules)
    .filter(
      ([, rule]) =>
        rule.meta.deprecated !== true &&
        rule.meta.docs.category === "No Other Paradigms" &&
        rule.meta.docs.recommended !== false,
    )
    .map(([name, rule]) => [
      `${ruleNameScope}/${name}`,
      rule.meta.docs.recommendedSeverity,
    ]),
) satisfies FlatConfig.Config["rules"];
