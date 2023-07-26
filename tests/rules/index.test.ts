import * as fs from "node:fs";

import { describe, it } from "vitest";

import { rules } from "#eslint-plugin-functional/rules";

describe("rules index", () => {
  it("to import all rule files", (t) => {
    const rulesNames: string[] = Object.keys(rules);
    const files: string[] = fs
      .readdirSync("./src/rules")
      .filter((file) => file !== "index.ts" && file.endsWith(".ts"));

    t.expect(rulesNames.length).to.equal(files.length);
  });
});
