/**
 * Rollup Config.
 */

import rollupPluginCommonjs from "@rollup/plugin-commonjs";
import rollupPluginJSON from "@rollup/plugin-json";
import rollupPluginNodeResolve from "@rollup/plugin-node-resolve";
import rollupPluginTypescript from "@rollup/plugin-typescript";
import { defineConfig, type Plugin } from "rollup";
import rollupPluginAutoExternal from "rollup-plugin-auto-external";

import pkg from "./package.json" assert { type: "json" };

const common = defineConfig({
  input: "src/index.ts",

  output: {
    sourcemap: false,
  },

  external: [],

  treeshake: {
    annotations: true,
    moduleSideEffects: [],
    propertyReadSideEffects: false,
    unknownGlobalSideEffects: false,
  },
});

/**
 * Get new instances of all the common plugins.
 */
function getPlugins() {
  return [
    rollupPluginAutoExternal(),
    rollupPluginNodeResolve(),
    rollupPluginCommonjs(),
    rollupPluginTypescript({
      tsconfig: "tsconfig.build.json",
    }),
    rollupPluginJSON({
      preferConst: true,
    }),
  ] as Plugin[];
}

const cjs = defineConfig({
  ...common,

  output: {
    ...common.output,
    file: pkg.exports.require,
    format: "cjs",
  },

  plugins: getPlugins(),
});

const esm = defineConfig({
  ...common,

  output: {
    ...common.output,
    file: pkg.exports.import,
    format: "esm",
  },

  plugins: getPlugins(),
});

export default [cjs, esm];
