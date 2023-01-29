/**
 * @file Tests the index file.
 */

import { readdirSync } from "node:fs";

import test from "ava";

import plugin from "~/index";

const ruleFiles: string[] = readdirSync("./src/rules").filter(
  (file) => file !== "index.ts" && file.endsWith(".ts")
);

const configFiles: string[] = readdirSync("./src/configs").filter(
  (file) => file !== "index.ts" && file.endsWith(".ts")
);

test("should have all the rules", (t) => {
  t.true(
    Object.hasOwn(plugin, "rules"),
    'The plugin\'s config object should have a "rules" property.'
  );
  t.is(ruleFiles.length, Object.keys(plugin.rules).length);
});

test("should have all the configs", (t) => {
  t.true(
    Object.hasOwn(plugin, "configs"),
    'The plugin\'s config object should have a "configs" property.'
  );
  t.is(
    configFiles.length - 1,
    Object.keys(plugin.configs).length,
    "should have all the configs except deprecated"
  );
});
