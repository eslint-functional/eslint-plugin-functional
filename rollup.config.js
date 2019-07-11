/**
 * Rollup Config.
 */
// @ts-check

import rollupPluginCommonjs from "rollup-plugin-commonjs";
import rollupPluginNodeResolve from "rollup-plugin-node-resolve";
import rollupPluginTypescript from "rollup-plugin-typescript2";
import rollupPluginJSON from "rollup-plugin-json";

export default {
  input: "src/index.ts",

  output: [
    {
      dir: "./lib",
      entryFileNames: "[name].js",
      chunkFileNames: "common/[hash].js",
      format: "cjs",
      sourcemap: false
    },
    {
      dir: "./lib",
      entryFileNames: "[name].mjs",
      chunkFileNames: "common/[hash].mjs",
      format: "esm",
      sourcemap: false
    }
  ],

  external: id => {
    return (
      // Not a Local File?
      !(id.startsWith(".") || id.startsWith("/"))
    );
  },

  plugins: [
    rollupPluginNodeResolve(),
    rollupPluginCommonjs(),
    rollupPluginTypescript({
      objectHashIgnoreUnknownHack: true
    }),
    rollupPluginJSON({
      preferConst: true
    })
  ],

  treeshake: {
    annotations: true,
    moduleSideEffects: [
      "array.prototype.flatmap/auto.js"
    ],
    propertyReadSideEffects: false
  }
};
