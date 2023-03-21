require("ts-node").register({
  cwd: __dirname,
  project: "./tsconfig.json",
});
require("tsconfig-paths").register();

// @ts-ignore
module.exports = require("./index.ts");
