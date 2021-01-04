import test from "ava";
import * as fs from "fs";

import { rules } from "~/rules";

const rulesNames: ReadonlyArray<string> = Object.keys(rules);
const files: ReadonlyArray<string> = fs
  .readdirSync("./src/rules")
  .filter((file) => file !== "index.ts" && file.endsWith(".ts"));

test("all rule files are imported", (t) => {
  t.is(rulesNames.length, files.length);
});
