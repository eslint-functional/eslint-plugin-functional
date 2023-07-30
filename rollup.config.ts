import rollupPluginTypescript from "@rollup/plugin-typescript";
import { defineConfig } from "rollup";
import rollupPluginAutoExternal from "rollup-plugin-auto-external";

import pkg from "./package.json" assert { type: "json" };

export default defineConfig({
  input: "src/index.ts",

  output: [
    {
      file: pkg.exports.import,
      format: "esm",
      sourcemap: false,
    },
    {
      file: pkg.exports.require,
      format: "cjs",
      sourcemap: false,
    },
  ],

  plugins: [rollupPluginAutoExternal(), rollupPluginTypescript()],

  external: [],

  treeshake: {
    annotations: true,
    moduleSideEffects: [],
    propertyReadSideEffects: false,
    unknownGlobalSideEffects: false,
  },
});
