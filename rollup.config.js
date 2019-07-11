/**
 * Rollup Config.
 */
// @ts-check

import rollupPluginCommonjs from "rollup-plugin-commonjs";
import rollupPluginNodeResolve from "rollup-plugin-node-resolve";
import rollupPluginTypescript from "rollup-plugin-typescript2";
import rollupPluginJSON from "rollup-plugin-json";
import rollupPluginCopy from "rollup-plugin-copy";

export default {
  input: "src/index.ts",

  output: [
    {
      dir: "./dist",
      entryFileNames: "[name].js",
      chunkFileNames: "common/[hash].js",
      format: "cjs",
      sourcemap: false
    },
    {
      dir: "./dist",
      entryFileNames: "[name].mjs",
      chunkFileNames: "common/[hash].mjs",
      format: "esm",
      sourcemap: false
    }
  ],

  external: id => {
    return (
      // Config File?
      (id.includes("./configs/") && id.endsWith(".json")) ||
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
    }),
    rollupPluginCopy({
      targets: [{ src: "src/configs/**/*.json", dest: "dist/configs" }],
      hook: "writeBundle"
    })
  ],

  treeshake: {
    pureExternalModules: id => {
      // List of non-pure externals.
      return ![
        "array.prototype.flatmap/auto.js"
      ].includes(id);
    },
    propertyReadSideEffects: false
  }
};
