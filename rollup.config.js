/**
 * Rollup Config.
 */
// @ts-check

import rollupPluginCommonjs from "rollup-plugin-commonjs";
import rollupPluginNodeResolve from "rollup-plugin-node-resolve";
import rollupPluginTypescript from "rollup-plugin-typescript2";
import rollupPluginJSON from "rollup-plugin-json";

const common = {
  input: "src/index.ts",

  external: id => {
    return (
      // Not a Local File?
      !(id.startsWith(".") || id.startsWith("/")) &&
      // Not a explicitly marked as internal?
      ![
        "@typescript-eslint/experimental-utils",
        "@typescript-eslint/typescript-estree"
      ].some(internal => id.startsWith(internal))
    );
  },

  treeshake: {
    annotations: true,
    moduleSideEffects: ["array.prototype.flatmap/auto.js"],
    propertyReadSideEffects: false
  }
};

const cjs = {
  ...common,

  output: {
    dir: "./lib",
    entryFileNames: "[name].js",
    chunkFileNames: "common/[hash].js",
    format: "cjs",
    sourcemap: false
  },

  plugins: [
    rollupPluginNodeResolve(),
    rollupPluginCommonjs(),
    rollupPluginTypescript({
      tsconfigOverride: { compilerOptions: { target: "es5" } }
    }),
    rollupPluginJSON({
      preferConst: true
    })
  ]
};

const esm = {
  ...common,

  output: {
    dir: "./lib",
    entryFileNames: "[name].mjs",
    chunkFileNames: "common/[hash].mjs",
    format: "esm",
    sourcemap: false
  },

  plugins: [
    rollupPluginNodeResolve(),
    rollupPluginCommonjs(),
    rollupPluginTypescript({
      tsconfigOverride: { compilerOptions: { target: "es2017" } }
    }),
    rollupPluginJSON({
      preferConst: true
    })
  ]
};

export default [cjs, esm];
