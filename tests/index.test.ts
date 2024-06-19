/**
 * @file Tests the index file.
 */

import { readdirSync } from "node:fs";

import { describe, expect, it } from "vitest";

import classic from "#/classic";
import flat from "#/flat";

describe("Flat", () => {
  it("should have all the rules", () => {
    const ruleFiles: string[] = readdirSync("./src/rules").filter(
      (file) => file !== "index.ts" && file.endsWith(".ts"),
    );

    expect(
      Object.hasOwn(flat, "rules"),
      'The plugin\'s config object should have a "rules" property.',
    );
    expect(ruleFiles.length).to.equal(Object.keys(flat.rules ?? {}).length);
  });

  it("should have all the configs", () => {
    const configFiles: string[] = readdirSync("./src/configs").filter(
      (file) => file !== "index.ts" && file.endsWith(".ts"),
    );

    expect(
      Object.hasOwn(flat, "configs"),
      'The plugin\'s config object should have a "configs" property.',
    );
    expect(configFiles.length).to.equal(
      Object.keys(flat.configs ?? {}).length,
      "should have all the configs except deprecated",
    );
  });
});

describe("Classic", () => {
  it("should have all the rules", () => {
    const ruleFiles: string[] = readdirSync("./src/rules").filter(
      (file) => file !== "index.ts" && file.endsWith(".ts"),
    );

    expect(
      Object.hasOwn(classic, "rules"),
      'The plugin\'s config object should have a "rules" property.',
    );
    expect(ruleFiles.length).to.equal(Object.keys(classic.rules ?? {}).length);
  });

  it("should have all the configs", () => {
    const configFiles: string[] = readdirSync("./src/configs").filter(
      (file) => file !== "index.ts" && file.endsWith(".ts"),
    );

    expect(
      Object.hasOwn(classic, "configs"),
      'The plugin\'s config object should have a "configs" property.',
    );
    expect(configFiles.length).to.equal(
      Object.keys(classic.configs ?? {}).length,
      "should have all the configs except deprecated",
    );
  });
});
