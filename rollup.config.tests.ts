import rollupPluginTypescript from "@rollup/plugin-typescript";
import { glob } from "glob";
import { defineConfig } from "rollup";
import rollupPluginAutoExternal from "rollup-plugin-auto-external";

const testFiles = await glob("./tests/**/*.test.ts");

export default defineConfig({
  input: Object.fromEntries(testFiles.map((file) => [file, file])),

  output: [
    {
      dir: "tests-compiled",
      format: "esm",
      sourcemap: true,
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
