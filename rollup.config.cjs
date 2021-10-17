require("ts-node").register({
  compilerOptions: {
    module: "CommonJS",
  },
});

module.exports = require("./rollup.config.ts");
