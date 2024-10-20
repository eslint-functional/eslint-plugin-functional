/**
 * @file Tests the index file.
 */

import { readdirSync } from "node:fs";

import { describe, expect, it } from "vitest";

import functional from "#";

describe("index", () => {
  it("should have all the rules", () => {
    const ruleFiles: string[] = readdirSync("./src/rules").filter(
      (file) => file !== "index.ts" && file.endsWith(".ts"),
    );

    expect(Object.hasOwn(functional, "rules"), 'The plugin\'s config object should have a "rules" property.');
    expect(ruleFiles.length).to.equal(Object.keys(functional.rules ?? {}).length);
  });

  it("should have all the configs", () => {
    const configFiles: string[] = readdirSync("./src/configs").filter(
      (file) => file !== "index.ts" && file.endsWith(".ts"),
    );

    expect(Object.hasOwn(functional, "configs"), 'The plugin\'s config object should have a "configs" property.');
    expect(configFiles.length).to.equal(
      Object.keys(functional.configs ?? {}).length,
      "should have all the configs except deprecated",
    );
  });
});
