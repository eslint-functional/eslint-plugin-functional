/**
 * @file Tests the index file.
 */

import { readdirSync } from "node:fs";

import { describe, it } from "vitest";

import plugin from "#eslint-plugin-functional";

describe("index.ts", () => {
  it("should have all the rules", (t) => {
    const ruleFiles: string[] = readdirSync("./src/rules").filter(
      (file) => file !== "index.ts" && file.endsWith(".ts"),
    );

    t.expect(
      Object.hasOwn(plugin, "rules"),
      'The plugin\'s config object should have a "rules" property.',
    );
    t.expect(ruleFiles.length).to.equal(Object.keys(plugin.rules ?? {}).length);
  });

  it("should have all the configs", (t) => {
    const configFiles: string[] = readdirSync("./src/configs").filter(
      (file) => file !== "index.ts" && file.endsWith(".ts"),
    );

    t.expect(
      Object.hasOwn(plugin, "configs"),
      'The plugin\'s config object should have a "configs" property.',
    );
    t.expect(configFiles.length - 1).to.equal(
      Object.keys(plugin.configs ?? {}).length,
      "should have all the configs except deprecated",
    );
  });
});
