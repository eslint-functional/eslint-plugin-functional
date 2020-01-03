/**
 * @file Tests the index file.
 */

import plugin from "../src/index";

import { readdirSync } from "fs";

describe("plugin", () => {
  const ruleFiles: ReadonlyArray<string> = readdirSync("./src/rules").filter(
    file => file !== "index.ts" && file.endsWith(".ts")
  );

  const configFiles: ReadonlyArray<string> = readdirSync(
    "./src/configs"
  ).filter(file => file !== "index.ts" && file.endsWith(".ts"));

  it("should have all the rules", () => {
    expect(plugin).toHaveProperty("rules");
    expect(Object.keys(plugin.rules)).toHaveLength(ruleFiles.length);
  });

  it("should have all the configs", () => {
    expect(plugin).toHaveProperty("configs");
    expect(Object.keys(plugin.configs)).toHaveLength(configFiles.length);
  });
});
