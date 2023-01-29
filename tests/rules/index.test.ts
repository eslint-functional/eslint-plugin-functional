import * as fs from "node:fs";

import test from "ava";

import { rules } from "~/rules";

const rulesNames: string[] = Object.keys(rules);
const files: string[] = fs
  .readdirSync("./src/rules")
  .filter((file) => file !== "index.ts" && file.endsWith(".ts"));

test("all rule files are imported", (t) => {
  t.is(rulesNames.length, files.length);
});
