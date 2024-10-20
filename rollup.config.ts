import rollupPluginReplace from "@rollup/plugin-replace";
import rollupPluginTypescript from "@rollup/plugin-typescript";
import type { RollupOptions } from "rollup";
import rollupPluginDeassert from "rollup-plugin-deassert";
import { generateDtsBundle } from "rollup-plugin-dts-bundle-generator";

import pkg from "./package.json" with { type: "json" };

type PackageJSON = typeof pkg & {
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
};

const externalDependencies = [
  ...Object.keys((pkg as PackageJSON).dependencies ?? {}),
  ...Object.keys((pkg as PackageJSON).peerDependencies ?? {}),
];

export default {
  input: "src/index.ts",

  output: {
    file: pkg.exports.default,
    format: "esm",
    sourcemap: false,
    generatedCode: {
      preset: "es2015",
    },
    plugins: [
      generateDtsBundle({
        compilation: {
          preferredConfigPath: "tsconfig.build.types.json",
        },
        outFile: pkg.exports.types,
      }) as any,
    ],
  },

  plugins: [
    rollupPluginTypescript({
      tsconfig: "tsconfig.build.json",
    }),
    rollupPluginReplace({
      values: {
        "import.meta.vitest": "undefined",
      },
      preventAssignment: true,
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
    if (source.startsWith("node:") || externalDependencies.some((dep) => source.startsWith(dep))) {
      return true;
    }
    return undefined;
  },
} satisfies RollupOptions;
