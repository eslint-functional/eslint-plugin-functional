import { rollupPlugin as rollupPluginDeassert } from "deassert";
import { type OutputOptions, type RollupOptions } from "rollup";
import rollupPluginAutoExternal from "rollup-plugin-auto-external";
import rollupPluginTs from "rollup-plugin-ts";

import pkg from "./package.json" assert { type: "json" };

const treeshake = {
  annotations: true,
  moduleSideEffects: [],
  propertyReadSideEffects: false,
  unknownGlobalSideEffects: false,
} satisfies RollupOptions["treeshake"];

const output = {
  sourcemap: false,
  generatedCode: {
    preset: "es2015",
  },
} satisfies Omit<OutputOptions, "file">;

function getPlugins(format: "esm" | "cjs"): RollupOptions["plugins"] {
  return [
    rollupPluginAutoExternal(),
    rollupPluginTs({
      transpileOnly: true,
      tsconfig: {
        fileName: "tsconfig.build.json",
        hook: (resolvedConfig) => ({
          ...resolvedConfig,
          paths: {
            ...resolvedConfig.paths,
            "#/conditional-imports/*": [
              `src/utils/conditional-imports/${format}/*`,
            ],
          },
        }),
      },
    }),
    rollupPluginDeassert({
      include: ["**/*.{js,ts}"],
    }),
  ];
}

const esm = {
  input: "src/index.ts",

  output: {
    ...output,
    file: pkg.exports.import,
    format: "esm",
  },

  plugins: getPlugins("esm"),

  treeshake,
} satisfies RollupOptions;

const cjs = {
  input: "src/index.ts",

  output: {
    ...output,
    file: pkg.exports.require,
    format: "cjs",
  },

  plugins: getPlugins("cjs"),

  treeshake,
} satisfies RollupOptions;

export default [cjs, esm];
