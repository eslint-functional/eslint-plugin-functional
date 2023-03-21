import rollupPluginCommonjs from "@rollup/plugin-commonjs";
import rollupPluginJSON from "@rollup/plugin-json";
import rollupPluginNodeResolve from "@rollup/plugin-node-resolve";
import rollupPluginTypescript from "@rollup/plugin-typescript";
import { defineConfig } from "rollup";
import rollupPluginAutoExternal from "rollup-plugin-auto-external";

import pkg from "./package.json" assert { type: "json" };

export default defineConfig({
  input: "src/index.ts",

  output: [
    {
      sourcemap: false,
      file: pkg.exports.import,
      format: "esm",
    },
    {
      sourcemap: false,
      file: pkg.exports.require,
      format: "cjs",
    },
  ],

  plugins: [
    rollupPluginAutoExternal(),
    rollupPluginNodeResolve(),
    rollupPluginCommonjs(),
    rollupPluginTypescript({
      tsconfig: "tsconfig.build.json",
    }),
    rollupPluginJSON({
      preferConst: true,
    }),
  ],

  external: [],

  treeshake: {
    annotations: true,
    moduleSideEffects: [],
    propertyReadSideEffects: false,
    unknownGlobalSideEffects: false,
  },
});
