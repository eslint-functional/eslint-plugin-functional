# Migrating from TSLint

In 2019, [palantir plans to deprecate TSLint](https://github.com/palantir/tslint/issues/4534) and support the migration to ESLint.
This guide is intended to help those who are using tslint-immutable to migrate their settings and projects to use eslint-plugin-functional.

## Configuration File

The eslint version of `tslint.json` (the configuration file) is `.eslintrc`.
See [eslint's docs](https://eslint.org/docs/user-guide/configuring) for mor information on this file.

Out of the box, eslint does not understand TypeScript. To get eslint to understand it we need to change the default parser to one that understands it.
This is where [@typescript-eslint](https://github.com/typescript-eslint/typescript-eslint) comes in.
In the config file, we can specify the parser to be used with the "parser" key. Any extra parser configuration can then be specified under the "parserOptions" key.
In order for the parser to have access to type information, it needs access to your `tsconfig.json`; you'll need to specify this under "parserOptions" -> "project".

### Example config

```json
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

| `eslint-plugin-functional` Rule                                                   | Equivalent `tslint-immutable` Rules                     |
| --------------------------------------------------------------------------------- | ------------------------------------------------------- |
| [`functional/prefer-readonly-type`](./docs/rules/prefer-readonly-type.md)         | `readonly-keyword` & `readonly-array`                   |
| [`functional/no-let`](./docs/rules/no-let.md)                                     | `no-let`                                                |
| [`functional/immutable-data`](./docs/rules/immutable-data.md)                     | `no-object-mutation`, `no-array-mutation` & `no-delete` |
| [`functional/no-method-signature`](./docs/rules/no-method-signature.md)           | `no-method-signature`                                   |
| [`functional/no-this`](./docs/rules/no-this.md)                                   | `no-this`                                               |
| [`functional/no-class`](./docs/rules/no-class.md)                                 | `no-class`                                              |
| [`functional/no-mixed-type`](./docs/rules/no-mixed-type.md)                       | `no-mixed-interface`                                    |
| [`functional/prefer-type-literal`](./docs/rules/prefer-type-literal.md)           | -                                                       |
| [`functional/no-expression-statement`](./docs/rules/no-expression-statement.md)   | `no-expression-statement`                               |
| [`functional/no-conditional-statement`](./docs/rules/no-conditional-statement.md) | `no-if-statement`                                       |
| [`functional/no-loop-statement`](./docs/rules/no-loop-statement.md)               | `no-loop-statement`                                     |
| [`functional/no-return-void`](./docs/rules/no-return-void.md)                     | -                                                       |
| [`functional/no-throw`](./docs/rules/no-throw.md)                                 | `no-throw`                                              |
| [`functional/no-try`](./docs/rules/no-try.md)                                     | `no-try`                                                |
| [`functional/no-reject`](./docs/rules/no-reject.md)                               | `no-reject`                                             |
| [`functional/functional-parameters`](./docs/rules/functional-parameters.md)       | -                                                       |
