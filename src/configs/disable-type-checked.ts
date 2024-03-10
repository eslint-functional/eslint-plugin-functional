import { type Linter } from "@typescript-eslint/utils/ts-eslint";

import { rules } from "#eslint-plugin-functional/rules";

const config: Linter.Config = {
  rules: Object.fromEntries(
    Object.entries(rules)
      .filter(([, rule]) => rule.meta.docs?.requiresTypeChecking === true)
      .map(([name]) => [`functional/${name}`, "off"]),
  ),
};

export default config;
