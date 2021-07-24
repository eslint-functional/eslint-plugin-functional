/**
 * @file Tests the index file.
 */

import test from "ava";
import { readdirSync } from "fs";

import plugin from "~/index";

const ruleFiles: ReadonlyArray<string> = readdirSync("./src/rules").filter(
  (file) => file !== "index.ts" && file.endsWith(".ts")
);

const configFiles: ReadonlyArray<string> = readdirSync("./src/configs").filter(
  (file) => file !== "index.ts" && file.endsWith(".ts")
);

test("should have all the rules", (t) => {
  t.true(
    Object.prototype.hasOwnProperty.call(plugin, "rules"),
    'The plugin\'s config object should have a "rules" property.'
  );
  t.assert(Object.keys(plugin.rules).length === ruleFiles.length);
});

test("should have all the configs", (t) => {
  t.true(
    Object.prototype.hasOwnProperty.call(plugin, "configs"),
    'The plugin\'s config object should have a "configs" property.'
  );
  t.assert(Object.keys(plugin.configs).length === configFiles.length);
});
