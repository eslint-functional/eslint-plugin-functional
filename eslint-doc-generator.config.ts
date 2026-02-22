import type { GenerateOptions } from "eslint-doc-generator";
import { format } from "prettier";

export default {
  configEmoji: [
    ["lite", "☑️"],
    ["currying", "![badge-currying](https://img.shields.io/badge/-currying-red.svg)"],
    ["noExceptions", "![badge-noExceptions](https://img.shields.io/badge/-noExceptions-blue.svg)"],
    ["noMutations", "![badge-noMutations](https://img.shields.io/badge/-noMutations-orange.svg)"],
    ["noOtherParadigms", "![badge-noOtherParadigms](https://img.shields.io/badge/-noOtherParadigms-yellow.svg)"],
    ["noStatements", "![badge-noStatements](https://img.shields.io/badge/-noStatements-purple.svg)"],
    ["disableTypeChecked", "![badge-disableTypeChecked](https://img.shields.io/badge/-disableTypeChecked-navy.svg)"],
  ],
  ignoreConfig: ["all", "off", "disable-type-checked"],
  ruleDocSectionInclude: ["Rule Details"],
  ruleListSplit: "meta.docs.category",
  postprocess: (doc) =>
    format(doc, {
      parser: "markdown",
    }),
} satisfies GenerateOptions;
