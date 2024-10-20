import * as fs from "node:fs";

import { describe, expect, it } from "vitest";

import { rules } from "#/rules";

describe("rules index", () => {
  it("import all the rule files", () => {
    const rulesNames: string[] = Object.keys(rules);
    const files: string[] = fs.readdirSync("./src/rules").filter((file) => file !== "index.ts" && file.endsWith(".ts"));

    expect(rulesNames.length).to.equal(files.length);
  });
});
