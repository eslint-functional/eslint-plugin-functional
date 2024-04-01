// @ts-check
import rsEslint from "@rebeccastevens/eslint-config";
import pluginEslint from "eslint-plugin-eslint-plugin";

export default rsEslint(
  {
    typescript: {
      tsconfig: "tsconfig.eslint.json",
      unsafe: "off",
    },
    stylistic: true,
    functional: "lite",
    formatters: true,
    jsonc: true,
    markdown: true,
    yaml: true,
    ignores: ["tests-compiled/"],
  },
  {
    plugins: {
      eslint: pluginEslint,
    },
    rules: {
      "functional/prefer-immutable-types": "off",

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
  {
    files: ["cz-adapter/**/*"],
    rules: {
      "no-console": "off",

      "import/no-extraneous-dependencies": [
        "error",
        {
          devDependencies: true,
          peerDependencies: true,
        },
      ],
      "import/no-useless-path-segments": "off",

      "jsdoc/require-jsdoc": "off",

      "functional/immutable-data": "off",
      "functional/no-conditional-statements": "off",
      "functional/no-expression-statements": "off",
      "functional/no-loop-statements": "off",
      "functional/no-return-void": "off",
      "functional/no-throw-statements": "off",
    },
  },
);
