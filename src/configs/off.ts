import { type FlatConfig } from "@typescript-eslint/utils/ts-eslint";

import { rules } from "#eslint-plugin-functional/rules";
import { ruleNameScope } from "#eslint-plugin-functional/utils/misc";

export default Object.fromEntries(
  Object.entries(rules).map(([name]) => [`${ruleNameScope}/${name}`, "off"]),
) satisfies FlatConfig.Config["rules"];
