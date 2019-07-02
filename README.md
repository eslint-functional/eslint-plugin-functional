# eslint-plugin-ts-immutable

[![npm version][version-image]][version-url]
[![travis build][travis-image]][travis-url]
[![Coverage Status][codecov-image]][codecov-url]
[![code style: prettier][prettier-image]][prettier-url]
[![MIT license][license-image]][license-url]

[ESLint](https://eslint.org/) rules to disable mutation in TypeScript.

## Background

In some applications it is important to not mutate any data, for example when using Redux to store state in a React application. Moreover immutable data structures has a lot of advantages in general so I want to use them everywhere in my applications.

I originally used [immutablejs](https://github.com/facebook/immutable-js/) for this purpose. It is a really nice library but I found it had some drawbacks. Specifically when debugging it was hard to see the structure, creating JSON was not straightforward, and passing parameters to other libraries required converting to regular mutable arrays and objects. The [seamless-immutable](https://github.com/rtfeldman/seamless-immutable) project seems to have the same conclusions and they use regular objects and arrays and check for immutability at run-time. This solves all the aformentioned drawbacks but introduces a new drawback of only being enforced at run-time. (Altough you loose the structural sharing feature of immutablejs with this solution so you would have to consider if that is something you need).

Then typescript 2.0 came along and introduced [readonly](https://github.com/Microsoft/TypeScript/wiki/What's-new-in-TypeScript#read-only-properties-and-index-signatures) options for properties, indexers and arrays. This enables us to use regular object and arrays and have the immutability enfored at compile time instead of run-time. Now the only drawback is that there is nothing enforcing the use of readonly in typescript.

This can be solved by using linting rules. So the aim of this project is to leverage the type system in typescript to enforce immutability at compile-time while still using regular objects and arrays.

## Installing

Make sure you have TypeScript and [@typescript-eslint/parser](https://www.npmjs.com/package/@typescript-eslint/parser) installed, then install the plugin:

```sh
npm i eslint-plugin-ts-immutable --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-ts-immutable` globally.

## Usage

Add `@typescript-eslint/parser` to the `parser` field and `ts-immutable` to the plugins section of your `.eslintrc` configuration file. Then configure the rules you want to use under the rules section.

```json
{
  "parser": "@typescript-eslint/parser",
  "plugins": ["ts-immutable"],
  "rules": {
    "@typescript-eslint/rule-name": "error"
  }
}
```

You can also enable all the recommended rules for our plugin:

```json
{
  "extends": ["plugin:ts-immutable/recommended"]
}
```

If you want to use rules which require type information, you will need to specify a path to your tsconfig.json file in the "project" property of "parserOptions".

```json
{
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": "./tsconfig.json"
  },
  "plugins": ["ts-immutable"],
  "rules": {
    "ts-immutable/no-array-mutation": "error"
  }
}
```

See [@typescript-eslint/parser's README.md](../parser/README.md) for more information on the available "parserOptions".

**Note: Make sure to use `eslint --ext .js,.ts` since by [default](https://eslint.org/docs/user-guide/command-line-interface#--ext) `eslint` will only search for .js files.**

## Supported Rules

In addition to immutable rules this project also contains a few rules for enforcing a functional style of programming. The following rules are available:

**Key**: :heavy_check_mark: = recommended, :wrench: = fixable, :thought_balloon: = requires type information

### Immutability rules

| Name                                                                      | Description                                                               | :heavy_check_mark: | :wrench: | :thought_balloon: |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------- | ------------------ | -------- | ----------------- |
| [`ts-immutable/readonly-keyword`](./docs/rules/readonly-keyword.md)       | Enforce readonly modifiers are used where possible                        | :heavy_check_mark: | :wrench: |                   |
| [`ts-immutable/readonly-array`](./docs/rules/readonly-array.md)           | Prefer readonly array over mutable arrays                                 | :heavy_check_mark: | :wrench: |                   |
| [`ts-immutable/no-let`](./docs/rules/no-let.md)                           | Disallow mutable variables                                                | :heavy_check_mark: | :wrench: |                   |
| [`ts-immutable/no-array-mutation`](./docs/rules/no-array-mutation.md)     | Disallow mutating arrays                                                  | :heavy_check_mark: |          | :thought_balloon: |
| [`ts-immutable/no-object-mutation`](./docs/rules/no-object-mutation.md)   | Disallow mutating objects                                                 | :heavy_check_mark: |          | :thought_balloon: |
| [`ts-immutable/no-method-signature`](./docs/rules/no-method-signature.md) | Prefer property signatures with readonly modifiers over method signatures | :heavy_check_mark: |          |                   |
| [`ts-immutable/no-delete`](./docs/rules/no-delete.md)                     | Disallow delete expressions                                               | :heavy_check_mark: |          |                   |

### Functional style rules

| Name                                                                              | Description                                                                      | :heavy_check_mark: | :wrench: | :thought_balloon: |
| --------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | ------------------ | -------- | ----------------- |
| [`ts-immutable/no-this`](./docs/rules/no-this.md)                                 | Disallow this access                                                             | :heavy_check_mark: |          |                   |
| [`ts-immutable/no-class`](./docs/rules/no-class.md)                               | Disallow classes                                                                 | :heavy_check_mark: |          |                   |
| [`ts-immutable/no-mixed-interface`](./docs/rules/no-mixed-interface.md)           | Restrict interfaces so that only members of the same kind of are allowed in them | :heavy_check_mark: |          |                   |
| [`ts-immutable/no-expression-statement`](./docs/rules/no-expression-statement.md) | Using expressions to cause side-effects not allowed                              | :heavy_check_mark: |          |                   |
| [`ts-immutable/no-if-statement`](./docs/rules/no-if-statement.md)                 | Disallow if statements                                                           | :heavy_check_mark: |          |                   |
| [`ts-immutable/no-loop-statement`](./docs/rules/no-loop-statement.md)             | Disallow imperative loops                                                        | :heavy_check_mark: |          |                   |
| [`ts-immutable/no-throw`](./docs/rules/no-throw.md)                               | Disallow throwing exceptions                                                     | :heavy_check_mark: |          |                   |
| [`ts-immutable/no-try`](./docs/rules/no-try.md)                                   | Disallow try-catch[-finally] and try-finally patterns                            | :heavy_check_mark: |          |                   |
| [`ts-immutable/no-reject`](./docs/rules/no-reject.md)                             | Disallow try-catch[-finally] and try-finally patterns                            | :heavy_check_mark: |          |                   |

## Recommended standard rules

In addition to the immutability rules above, there are a few standard rules that needs to be enabled to achieve immutability.

### [no-var](https://eslint.org/docs/rules/no-var)

Without this rule, it is still possible to create `var` variables that are mutable.

### [no-param-reassign](https://eslint.org/docs/rules/no-param-reassign)

Without this rule, function parameters are mutable.

### [@typescript-eslint/explicit-function-return-type](https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/explicit-function-return-type.md)

For performance reasons, tslint-immutable does not check implicit return types. So for example this function will return an mutable array but will not be detected:

```javascript
function foo() {
  return [1, 2, 3];
}
```

To avoid this situation you can enable `@typescript-eslint/explicit-function-return-type`. Now the above function is forced to declare the return type and the mutability will be detected.

## How to contribute

For new features file an issue. For bugs, file an issue and optionally file a PR with a failing test.

## How to develop

To execute the tests run `yarn test`.

To learn about eslint plugin development se the [relevant section](https://eslint.org/docs/developer-guide/working-with-plugins) of the eslit docs. You can also checkout the [typescript-eslint](https://github.com/typescript-eslint/typescript-eslint) repo which has some more information specific to typescript.

In order to know which AST nodes are created for a snippet of typescript code you can use [ast explorer](https://astexplorer.net/) with options JavaScript and @typescript-eslint/parser.

## How to publish

```
yarn version --patch
yarn version --minor
yarn version --major
```

## Prior work

This work was originally inspired by [eslint-plugin-immutable](https://github.com/jhusain/eslint-plugin-immutable).

[version-image]: https://img.shields.io/npm/v/eslint-plugin-ts-immutable.svg?style=flat
[version-url]: https://www.npmjs.com/packageeslint-plugin-ts-immutable
[travis-image]: https://travis-ci.com/jonaskello/eslint-plugin-ts-immutable.svg?branch=master&style=flat
[travis-url]: https://travis-ci.com/jonaskello/eslint-plugin-ts-immutable
[codecov-image]: https://codecov.io/gh/jonaskello/eslint-plugin-ts-immutable/branch/master/graph/badge.svg
[codecov-url]: https://codecov.io/gh/jonaskello/eslint-plugin-ts-immutable
[license-image]: https://img.shields.io/github/license/jonaskello/eslint-plugin-ts-immutable.svg?style=flat
[license-url]: https://opensource.org/licenses/MIT
[prettier-image]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat
[prettier-url]: https://github.com/prettier/prettier
[type-info-badge]: https://img.shields.io/badge/type_info-required-d51313.svg?style=flat
[type-info-url]: https://palantir.github.io/tslint/usage/type-checking
