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

const classicCJS = {
  input: "src/classic.ts",

  output: {
    file: pkg.exports["."].require,
    format: "cjs",
    sourcemap: false,
  },

  plugins: [
    rollupPluginAutoExternal(),
    rollupPluginTs({
      transpileOnly: true,
      tsconfig: {
        fileName: "tsconfig.build.json",
        hook: (resolvedConfig) => ({
          ...resolvedConfig,
          paths: {
            ...resolvedConfig.paths,
            "#eslint-plugin-functional/conditional-imports/*": [
              "src/utils/conditional-imports/cjs/*",
            ],
          },
        }),
      },
    }),
    rollupPluginDeassert({
      include: ["**/*.{js,ts}"],
    }),
  ],

  treeshake,
} satisfies RollupOptions;

const classicESM = {
  input: "src/classic.ts",

  output: {
    file: pkg.exports["."].import,
    format: "esm",
    sourcemap: false,
  },

  plugins: [
    rollupPluginAutoExternal(),
    rollupPluginTs({
      transpileOnly: true,
      tsconfig: {
        fileName: "tsconfig.build.json",
        hook: (resolvedConfig) => ({
          ...resolvedConfig,
          paths: {
            ...resolvedConfig.paths,
            "#eslint-plugin-functional/conditional-imports/*": [
              "src/utils/conditional-imports/esm/*",
            ],
          },
        }),
      },
    }),
    rollupPluginDeassert({
      include: ["**/*.{js,ts}"],
    }),
  ],

  treeshake,
} satisfies RollupOptions;

const flatCJS = {
  input: "src/flat.ts",

  output: {
    file: pkg.exports["./flat"].require,
    format: "cjs",
    sourcemap: false,
  },

  plugins: [
    rollupPluginAutoExternal(),
    rollupPluginTs({
      transpileOnly: true,
      tsconfig: {
        fileName: "tsconfig.build.json",
        hook: (resolvedConfig) => ({
          ...resolvedConfig,
          paths: {
            ...resolvedConfig.paths,
            "#eslint-plugin-functional/conditional-imports/*": [
              "src/utils/conditional-imports/cjs/*",
            ],
          },
        }),
      },
    }),
    rollupPluginDeassert({
      include: ["**/*.{js,ts}"],
    }),
  ],

  treeshake,
} satisfies RollupOptions;

const flatESM = {
  input: "src/flat.ts",

  output: {
    file: pkg.exports["./flat"].import,
    format: "esm",
    sourcemap: false,
  },

  plugins: [
    rollupPluginAutoExternal(),
    rollupPluginTs({
      transpileOnly: true,
      tsconfig: {
        fileName: "tsconfig.build.json",
        hook: (resolvedConfig) => ({
          ...resolvedConfig,
          paths: {
            ...resolvedConfig.paths,
            "#eslint-plugin-functional/conditional-imports/*": [
              "src/utils/conditional-imports/esm/*",
            ],
          },
        }),
      },
    }),
    rollupPluginDeassert({
      include: ["**/*.{js,ts}"],
    }),
  ],

  treeshake,
} satisfies RollupOptions;

export default [classicCJS, classicESM, flatCJS, flatESM];
