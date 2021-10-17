require("ts-node").register({
  compilerOptions: {
    module: "CommonJS",
  },
});

module.exports = require("./ava.config.ts").default;
