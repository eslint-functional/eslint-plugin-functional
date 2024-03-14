import { rollupPlugin as rollupPluginDeassert } from "deassert";
import { type RollupOptions } from "rollup";
import rollupPluginAutoExternal from "rollup-plugin-auto-external";
import rollupPluginTs from "rollup-plugin-ts";

import pkg from "./package.json" assert { type: "json" };

const treeshake = {
  annotations: true,
  moduleSideEffects: [],
  propertyReadSideEffects: false,
  unknownGlobalSideEffects: false,
} satisfies RollupOptions["treeshake"];

const classic = {
  input: "src/classic.ts",

  output: [
    {
      file: pkg.exports["."].import,
      format: "esm",
      sourcemap: false,
    },
    {
      file: pkg.exports["."].require,
      format: "cjs",
      sourcemap: false,
    },
  ],

  plugins: [
    rollupPluginAutoExternal(),
    rollupPluginTs({
      transpileOnly: true,
      tsconfig: "tsconfig.build.json",
    }),
    rollupPluginDeassert({
      include: ["**/*.{js,ts}"],
    }),
  ],

  treeshake,
} satisfies RollupOptions;

const flat = {
  input: "src/flat.ts",

  output: [
    {
      file: pkg.exports["./flat"].import,
      format: "esm",
      sourcemap: false,
    },
    {
      file: pkg.exports["./flat"].require,
      format: "cjs",
      sourcemap: false,
    },
  ],

  plugins: [
    rollupPluginAutoExternal(),
    rollupPluginTs({
      transpileOnly: true,
      tsconfig: "tsconfig.build.json",
    }),
    rollupPluginDeassert({
      include: ["**/*.{js,ts}"],
    }),
  ],

  treeshake,
} satisfies RollupOptions;

export default [classic, flat];
