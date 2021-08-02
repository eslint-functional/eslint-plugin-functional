require("ts-node").register({
  compilerOptions: {
    module: "CommonJS",
  },
});
require("tsconfig-paths").register();

module.exports = require("./index.ts");
