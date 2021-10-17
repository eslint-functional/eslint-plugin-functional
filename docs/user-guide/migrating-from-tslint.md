# Migrating from TSLint

[TSLint is now deprecate](https://github.com/palantir/tslint/issues/4534).
This guide is intended to help those who are using tslint-immutable to migrate their settings and projects to use eslint-plugin-functional.

## Configuration File

The ESLint version of `tslint.json` (the configuration file) is `.eslintrc`.
See [ESLint's docs](https://eslint.org/docs/user-guide/configuring) for more information on this file.

Out of the box, ESLint does not understand TypeScript. To get ESLint to understand it we need to change the default parser to one that understands it.
This is where [@typescript-eslint](https://github.com/typescript-eslint/typescript-eslint) comes in.
In the config file, we can specify the parser to be used with the "parser" key. Any extra parser configuration can then be specified under the "parserOptions" key.
In order for the parser to have access to type information, it needs access to your `tsconfig.json`; you'll need to specify this under "parserOptions" -> "project".

### Example config

```jsonc
{
  "root": true,
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 10,
    "project": "./tsconfig.json",
    "sourceType": "module"
  },
  "plugins": [
    "functional"
  ],
  "env": {
    "es6": true
  },
  "extends": [
    "plugin:functional/recommended"
  ],
  "rules": {
    // These rules will be applied to all linted file.
  },
  "overrides": [
    {
      "files": ["*.ts", "*.tsx"],
      "rules": {
        // These rules will only be applied to ts file.
      }
    }
  ]
}
```

## Rules

Below is a table mapping the `eslint-plugin-functional` rules to their `tslint-immutable` equivalents.

| `eslint-plugin-functional` Rule                                               | Equivalent `tslint-immutable` Rules                     |
| ----------------------------------------------------------------------------- | ------------------------------------------------------- |
| [`functional/prefer-readonly-type`](../rules/prefer-readonly-type.md)         | `readonly-keyword` & `readonly-array`                   |
| [`functional/no-let`](../rules/no-let.md)                                     | `no-let`                                                |
| [`functional/immutable-data`](../rules/immutable-data.md)                     | `no-object-mutation`, `no-array-mutation` & `no-delete` |
| [`functional/no-method-signature`](../rules/no-method-signature.md)           | `no-method-signature`                                   |
| [`functional/no-this-expression`](../rules/no-this-expression.md)             | `no-this`                                               |
| [`functional/no-class`](../rules/no-class.md)                                 | `no-class`                                              |
| [`functional/no-mixed-type`](../rules/no-mixed-type.md)                       | `no-mixed-interface`                                    |
| [`functional/no-expression-statement`](../rules/no-expression-statement.md)   | `no-expression-statement`                               |
| [`functional/no-conditional-statement`](../rules/no-conditional-statement.md) | `no-if-statement`                                       |
| [`functional/no-loop-statement`](../rules/no-loop-statement.md)               | `no-loop-statement`                                     |
| [`functional/no-return-void`](../rules/no-return-void.md)                     | -                                                       |
| [`functional/no-throw-statement`](../rules/no-throw-statement.md)             | `no-throw`                                              |
| [`functional/no-try-statement`](../rules/no-try-statement.md)                 | `no-try`                                                |
| [`functional/no-promise-reject`](../rules/no-promise-reject.md)               | `no-reject`                                             |
| [`functional/functional-parameters`](../rules/functional-parameters.md)       | -                                                       |
