import { type GenerateOptions } from "eslint-doc-generator";
import { format } from "prettier";

export default {
  configEmoji: [["lite", "☑️"]],
  ignoreConfig: [
    "all",
    "off",
    "disable-type-checked",
    "flat/all",
    "flat/currying",
    "flat/disable-type-checked",
    "flat/external-typescript-recommended",
    "flat/external-vanilla-recommended",
    "flat/lite",
    "flat/no-exceptions",
    "flat/no-mutations",
    "flat/no-other-paradigms",
    "flat/no-statements",
    "flat/off",
    "flat/recommended",
    "flat/strict",
    "flat/stylistic",
  ],
  ruleDocSectionInclude: ["Rule Details"],
  ruleListSplit: "meta.docs.category",
  postprocess: (doc) => format(doc, { parser: "markdown" }),
} satisfies GenerateOptions;
