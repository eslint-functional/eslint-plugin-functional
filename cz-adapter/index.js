require("ts-node").register({
  transpileOnly: true,
  emit: true,
  compilerOptions: {
    module: "CommonJS",
  },
});
require("tsconfig-paths").register();

module.exports = require("./index.ts");
