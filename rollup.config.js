require("ts-node").register({
  compilerOptions: {
    module: "CommonJS",
  },
});
require("tsconfig-paths").register();

// eslint-disable-next-line import/no-useless-path-segments
module.exports = require("./rollup.config.ts");
