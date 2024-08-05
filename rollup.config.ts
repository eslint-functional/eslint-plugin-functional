import { rollupPlugin as rollupPluginDeassert } from "deassert";
import type { RollupOptions } from "rollup";
import rollupPluginTs from "rollup-plugin-ts";

import pkg from "./package.json" assert { type: "json" };

const externalDependencies = [
  ...Object.keys(pkg.dependencies ?? {}),
  ...Object.keys(pkg.peerDependencies ?? {}),
];

const esm = {
  input: "src/index.ts",

  output: {
    file: pkg.exports.default,
    format: "esm",
    sourcemap: false,
    generatedCode: {
      preset: "es2015",
    },
  },

  plugins: [
    rollupPluginTs({
      transpileOnly: true,
      tsconfig: "tsconfig.build.json",
    }),
    rollupPluginDeassert({
      include: ["**/*.{js,ts}"],
    }),
  ],

  treeshake: {
    annotations: true,
    moduleSideEffects: [],
    propertyReadSideEffects: false,
    unknownGlobalSideEffects: false,
  },

  external: (source) => {
    if (
      source.startsWith("node:") ||
      externalDependencies.some((dep) => source.startsWith(dep))
    ) {
      return true;
    }
    return undefined;
  },
} satisfies RollupOptions;

export default [esm] as RollupOptions[];
