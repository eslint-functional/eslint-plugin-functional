/**
 * Rollup Config.
 */
// @ts-check

import rollupPluginCommonjs from "@rollup/plugin-commonjs";
import rollupPluginNodeResolve from "@rollup/plugin-node-resolve";
import rollupPluginTypescript from "@rollup/plugin-typescript";
import rollupPluginJSON from "@rollup/plugin-json";
import rollupPluginAutoExternal from "rollup-plugin-auto-external";

const polyfills = [
  "array.prototype.flatmap/auto.js",
  "object.fromentries/auto.js",
];

const common = {
  input: "src/index.ts",

  output: {
    dir: "./lib",
    exports: "default",
    sourcemap: false,
  },

  external: polyfills,

  treeshake: {
    annotations: true,
    moduleSideEffects: polyfills,
    propertyReadSideEffects: false,
    unknownGlobalSideEffects: false,
  },
};

/**
 * Get new instances of all the common plugins.
 */
function getPlugins() {
  return [
    rollupPluginAutoExternal(),
    rollupPluginNodeResolve(),
    rollupPluginCommonjs(),
    rollupPluginTypescript(),
    rollupPluginJSON({
      preferConst: true,
    }),
  ];
}

const cjs = {
  ...common,

  output: {
    ...common.output,
    entryFileNames: "[name].js",
    format: "cjs",
  },

  plugins: getPlugins(),
};

const esm = {
  ...common,

  output: {
    ...common.output,
    entryFileNames: "[name].mjs",
    format: "esm",
  },

  plugins: getPlugins(),
};

export default [cjs, esm];
