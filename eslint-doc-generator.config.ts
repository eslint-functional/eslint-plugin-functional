import type { GenerateOptions } from "eslint-doc-generator";
import { format, resolveConfig } from "prettier";

export default {
  configEmoji: [["lite", "☑️"]],
  ignoreConfig: ["all", "off", "disable-type-checked"],
  ruleDocSectionInclude: ["Rule Details"],
  ruleListSplit: "meta.docs.category",
  postprocess: (doc) =>
    resolveConfig(import.meta.url).then((options) =>
      format(doc, { ...options, parser: "markdown" }),
    ),
} satisfies GenerateOptions;
