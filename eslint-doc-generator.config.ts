import type { GenerateOptions } from "eslint-doc-generator";
import { format } from "prettier";

export default {
  configEmoji: [["lite", "☑️"]],
  ignoreConfig: ["all", "off", "disable-type-checked"],
  ruleDocSectionInclude: ["Rule Details"],
  ruleListSplit: "meta.docs.category",
  postprocess: (doc) =>
    format(doc, {
      parser: "markdown",
    }),
} satisfies GenerateOptions;
