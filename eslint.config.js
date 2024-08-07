// @ts-check
import rsEslint from "@rebeccastevens/eslint-config";
// @ts-expect-error - Untyped.
import pluginEslint from "eslint-plugin-eslint-plugin";
import glob from "fast-glob";
import { tsImport } from "tsx/esm/api";

const local = await tsImport("./src/index.ts", import.meta.url).then(
  (r) => r.default,
);

const configs = await rsEslint(
  {
    projectRoot: import.meta.dirname,
    mode: "library",
    typescript: {
      unsafe: "off",
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
        projectService: {
          defaultProject: "./tsconfig.json",
          allowDefaultProject: glob
            .sync("./**/*.md", {
              cwd: import.meta.dirname,
              ignore: ["**/node_modules/**", "**/coverage/**"],
            })
            .map((file) => `${file}/*`),
          maximumDefaultProjectFileMatchCount_THIS_WILL_SLOW_DOWN_LINTING: 1000,
        },
      },
    },
    formatters: true,
    functional: {
      functionalEnforcement: "lite",
      overrides: {
        "functional/no-throw-statements": "off",
      },
    },
    jsonc: true,
    markdown: {
      enableTypeRequiredRules: true,
      overrides: {
        "functional/immutable-data": "off",
        "functional/no-loop-statements": "off",
        "functional/readonly-type": "off",
      },
    },
    stylistic: true,
    yaml: true,
  },
  {
    plugins: {
      eslint: pluginEslint,
    },
    rules: {
      // Some types say they have nonnullable properties, but they don't always.
      "ts/no-unnecessary-condition": "off",
    },
  },
  {
    files: ["src/**/*"],
    rules: {
      "eslint/fixer-return": "error",
      "eslint/meta-property-ordering": "error",
      "eslint/no-deprecated-context-methods": "error",
      "eslint/no-deprecated-report-api": "error",
      "eslint/no-missing-message-ids": "error",
      "eslint/no-missing-placeholders": "error",
      "eslint/no-property-in-node": "error",
      "eslint/no-unused-message-ids": "error",
      "eslint/no-unused-placeholders": "error",
      "eslint/no-useless-token-range": "error",
      "eslint/prefer-message-ids": "error",
      "eslint/prefer-object-rule": "error",
      "eslint/prefer-placeholders": "error",
      "eslint/prefer-replace-text": "error",
      "eslint/report-message-format": "error",
      "eslint/require-meta-docs-description": "error",
      "eslint/require-meta-docs-url": "error",
      "eslint/require-meta-fixable": "error",
      "eslint/require-meta-has-suggestions": "error",
      "eslint/require-meta-schema": "error",
      "eslint/require-meta-type": "error",
      "eslint/consistent-output": "error",
      "eslint/no-identical-tests": "error",
      "eslint/no-only-tests": "error",
      "eslint/prefer-output-null": "error",
      "eslint/test-case-property-ordering": "error",
      "eslint/test-case-shorthand-strings": "error",
    },
  },
  {
    files: ["src/configs/**/*", "src/index.ts"],
    rules: {
      "ts/naming-convention": "off",
    },
  },
  {
    files: ["src/utils/type-guards.ts", "src/utils/node-types.ts"],
    rules: {
      "jsdoc/require-jsdoc": "off",
    },
  },
  {
    files: ["src/utils/conditional-imports/**/*"],
    rules: {
      "@typescript-eslint/no-var-requires": "off",
      "functional/functional-parameters": "off",
      "functional/no-try-statements": "off",
      "import/no-extraneous-dependencies": [
        "error",
        {
          peerDependencies: true,
        },
      ],
      "unicorn/prefer-module": "off",
    },
  },
  {
    files: ["tests/**/*"],
    rules: {
      "functional/no-return-void": "off",
      "jsdoc/require-jsdoc": "off",
    },
  },
);

// Use our local version of the plugin.
// eslint-disable-next-line functional/no-loop-statements
for (const config of configs) {
  if (config?.plugins?.["functional"] !== undefined) {
    config.plugins["functional"] = local;
  }
}

export default configs;
