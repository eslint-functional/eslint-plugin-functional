import type { FlatConfig } from "@typescript-eslint/utils/ts-eslint";

import { rules } from "#/rules";
import { ruleNameScope } from "#/utils/misc";

export default Object.fromEntries(
  Object.entries(rules).map(([name]) => [`${ruleNameScope}/${name}`, "off"]),
) satisfies FlatConfig.Config["rules"] as NonNullable<FlatConfig.Config["rules"]>;
