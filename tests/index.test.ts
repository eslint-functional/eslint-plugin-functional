/**
 * @file Tests the index file.
 */

import { readdirSync } from "fs";

import plugin from "~";

describe("plugin", () => {
  const ruleFiles: ReadonlyArray<string> = readdirSync("./src/rules").filter(
    (file) => file !== "index.ts" && file.endsWith(".ts")
  );

  const configFiles: ReadonlyArray<string> = readdirSync(
    "./src/configs"
  ).filter((file) => file !== "index.ts" && file.endsWith(".ts"));

  it("should have all the rules", () => {
    expect.assertions(2);
    expect(plugin).toHaveProperty("rules");
    expect(Object.keys(plugin.rules)).toHaveLength(ruleFiles.length);
  });

  it("should have all the configs", () => {
    expect.assertions(2);
    expect(plugin).toHaveProperty("configs");
    expect(Object.keys(plugin.configs)).toHaveLength(configFiles.length);
  });
});
