# eslint-plugin-functional

[![npm version][version-image]][version-url]
[![travis build][travis-image]][travis-url]
[![Coverage Status][codecov-image]][codecov-url]
[![code style: prettier][prettier-image]][prettier-url]
[![MIT license][license-image]][license-url]

[ESLint](https://eslint.org/) rules to disable mutation and promote fp in JavaScript and TypeScript.

## Introduction

> :wave: If you previously used the rules in [tslint-immutable](https://www.npmjs.com/package/tslint-immutable), this package is the eslint version of those rules. Please see the [migration guide](docs/user-guide/migrating-from-tslint.md) for how to migrate.

This package has a collection of eslint rules to promote functional programming style concepts. Note that you can use this package to enforce only some aspects of functional programming, for example only immutability. There are also options for the rules that allow you to gradually adopt a functional style. Most rules can be used both for JavaScript and TypeScript, however some rules, for example enforcing the `readonly` keyword, is of course only available for TypeScript.

We've identified the following areas that needs to be linted in order to promote functional style in TypeScript/JavaScript:

- [No mutability](#no-mutability)
- [No object-orientation](#no-object-orientation)
- [No statements](#no-statements)
- [No exceptions](#no-exceptions)
- [Currying](#currying)

### No mutability

In some applications it is important to not mutate any data, for example when using Redux to store state in a React application. Moreover immutable data structures has a lot of advantages in general so I want to use them everywhere in my applications.

I originally used [immutablejs](https://github.com/facebook/immutable-js/) for this purpose. It is a really nice library but I found it had some drawbacks. Specifically when debugging it was hard to see the structure, creating JSON was not straightforward, and passing parameters to other libraries required converting to regular mutable arrays and objects. The [seamless-immutable](https://github.com/rtfeldman/seamless-immutable) project seems to have the same conclusions and they use regular objects and arrays and check for immutability at run-time. This solves all the aformentioned drawbacks but introduces a new drawback of only being enforced at run-time. (Altough you loose the structural sharing feature of immutablejs with this solution so you would have to consider if that is something you need).

Then TypeScript 2.0 came along and introduced [readonly](https://github.com/Microsoft/TypeScript/wiki/What's-new-in-TypeScript#read-only-properties-and-index-signatures) options for properties, indexers and arrays. TypeScript 3.0 has continued to add support immutability enforcing syntax. This enables us to use regular object and arrays and have the immutability enforced at compile time instead of run-time. Now the only drawback is that there is nothing enforcing the use of readonly in TypeScript.

This can be solved by using linting rules. So one aim of this project is to leverage the type system in TypeScript to enforce immutability at compile-time while still using regular objects and arrays. Additionally, this project will also aim to support disabling mutability for vanilla JavaScript where possible.

### No object-orientation

JavaScript is multi-paradigm, allowing both object-oriented and functional programming styles. In order to promote a functional style, the object oriented features of JavaScript needs to be disabled.

### No statements

In functional programming everything is an expression that produces a value. Javascript has a lot of syntax that is just statements that does not produce a value. That syntax has to be disabled to promote a functional style.

### No exceptions

Functional programming style does not use run-time exceptions. Instead expressions produces values to indicate errors.

### Currying

Javascript functions support syntax that is not compatible with curried functions. To enable currying this syntax has to be disabled.

## Installing

```sh
npm install eslint eslint-plugin-functional --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-functional` globally.

To use this plugin with TypeScript, additionally install [@typescript-eslint/parser](https://www.npmjs.com/package/@typescript-eslint/parser).

```sh
npm install eslint @typescript-eslint/parser eslint-plugin-functional --save-dev
```

## Usage

Add `ts-immutable` to the plugins section of your `.eslintrc` configuration file. Then configure the rules you want to use under the rules section.

```json
{
  "plugins": ["ts-immutable"],
  "rules": {
    "ts-immutable/rule-name": "error"
  }
}
```

The following rulesets are provided by this plugin.
[See bellow](#supported-rules) for what rules are including in each.

- `recommended`
- `functional-lite`
- `functional`

You can enable one of these rulesets like so:

```json
{
  "extends": ["plugin:ts-immutable/recommended"]
}
```

### With TypeScript

`@typescript-eslint/parser` is needed to parse TypeScript code; add `@typescript-eslint/parser` to the "parser" filed in your `.eslintrc` configuration file.
Additionally, for this plugin to use type information, you will need to specify a path to your tsconfig.json file in the "project" property of "parserOptions".

```json
{
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": "./tsconfig.json"
  },
  "plugins": ["ts-immutable"],
  "rules": {
    "ts-immutable/rule-name": "error"
  }
}
```

See [@typescript-eslint/parser's README.md](https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/parser#readme) for more information on the available "parserOptions".

**Note: Make sure to use `eslint --ext .js,.ts` since by [default](https://eslint.org/docs/user-guide/command-line-interface#--ext) `eslint` will only search for .js files.**

## Supported Rules

**Key**:

|      Symbol       | Meaning                                                                                                                                |
| :---------------: | -------------------------------------------------------------------------------------------------------------------------------------- |
|   :see_no_evil:   | Ruleset: Recommended<br><sub><sup>This ruleset is designed to enforce immutability in the code.</sup></sub>                            |
|  :hear_no_evil:   | Ruleset: Functional Lite<br><sub><sup>This ruleset is designed to enforce a somewhat functional programming code style.</sup></sub>    |
|  :speak_no_evil:  | Ruleset: Functional<br><sub><sup>This ruleset is designed to enforce a functional programming code style.</sup></sub>                  |
|     :wrench:      | Fixable<br><sub><sup>Problems found by this rule are potentially fixable with the `--fix` option.</sup></sub>                          |
| :thought_balloon: | Only Avaliable for TypeScript<br><sub><sup>The rule either requires Type Information or only works with TypeScript syntax.</sup></sub> |
|   :blue_heart:    | Works better with TypeScript<br><sub><sup>Type Information will be used if available making the rule work in more case.</sup></sub>    |

### No mutability

| Name                                                             | Description                                                                | <span title="Recommended">:see_no_evil:</span> | <span title="Functional Lite">:hear_no_evil:</span> | <span title="Functional">:speak_no_evil:</span> | :wrench: |   :blue_heart:    |
| ---------------------------------------------------------------- | -------------------------------------------------------------------------- | :--------------------------------------------: | :-------------------------------------------------: | :---------------------------------------------: | :------: | :---------------: |
| [`prefer-readonly-types`](./docs/rules/prefer-readonly-types.md) | Use readonly types and readonly modifiers where possible                   |               :heavy_check_mark:               |                 :heavy_check_mark:                  |               :heavy_check_mark:                | :wrench: | :thought_balloon: |
| [`no-let`](./docs/rules/no-let.md)                               | Disallow mutable variables                                                 |               :heavy_check_mark:               |                 :heavy_check_mark:                  |               :heavy_check_mark:                |          |                   |
| [`immutable-data`](./docs/rules/immutable-data.md)               | Disallow mutating objects and arrays                                       |               :heavy_check_mark:               |                 :heavy_check_mark:                  |               :heavy_check_mark:                |          |   :blue_heart:    |
| [`no-method-signature`](./docs/rules/no-method-signature.md)     | Enforce property signatures with readonly modifiers over method signatures |               :heavy_check_mark:               |                 :heavy_check_mark:                  |               :heavy_check_mark:                |          | :thought_balloon: |
| <td colspan=2> No object-orientation                             |
| [`no-method-signature`](./docs/rules/no-method-signature.md)     | Enforce property signatures with readonly modifiers over method signatures |               :heavy_check_mark:               |                 :heavy_check_mark:                  |               :heavy_check_mark:                |          | :thought_balloon: |

### No object-orientation

| Name                                                       | Description                                                                   | <span title="Recommended">:see_no_evil:</span> | <span title="Functional Lite">:hear_no_evil:</span> | <span title="Functional">:speak_no_evil:</span> | :wrench: |   :blue_heart:    |
| ---------------------------------------------------------- | ----------------------------------------------------------------------------- | :--------------------------------------------: | :-------------------------------------------------: | :---------------------------------------------: | :------: | :---------------: |
| [`no-this`](./docs/rules/no-this.md)                       | Disallow this access                                                          |                                                |                 :heavy_check_mark:                  |               :heavy_check_mark:                |          |                   |
| [`no-class`](./docs/rules/no-class.md)                     | Disallow classes                                                              |                                                |                 :heavy_check_mark:                  |               :heavy_check_mark:                |          |                   |
| [`no-mixed-interface`](./docs/rules/no-mixed-interface.md) | Restrict interfaces so that only members of the same kind are allowed in them |                                                |                 :heavy_check_mark:                  |               :heavy_check_mark:                |          | :thought_balloon: |

### No statements

| Name                                                                   | Description                                                | <span title="Recommended">:see_no_evil:</span> | <span title="Functional Lite">:hear_no_evil:</span> | <span title="Functional">:speak_no_evil:</span> | :wrench: |   :blue_heart:    |
| ---------------------------------------------------------------------- | ---------------------------------------------------------- | :--------------------------------------------: | :-------------------------------------------------: | :---------------------------------------------: | :------: | :---------------: |
| [`no-expression-statement`](./docs/rules/no-expression-statement.md)   | Disallow expressions to cause side-effects                 |                                                |                                                     |               :heavy_check_mark:                |          |                   |
| [`no-conditional-statement`](./docs/rules/no-conditional-statement.md) | Disallow conditional statements (if and switch statements) |                                                |                                                     |               :heavy_check_mark:                |          |                   |
| [`no-loop-statement`](./docs/rules/no-loop-statement.md)               | Disallow imperative loops                                  |                                                |                 :heavy_check_mark:                  |               :heavy_check_mark:                |          |                   |
| [`no-return-void`](./docs/rules/no-return-void.md)                     | Disallow function that return nothing                      |                                                |                 :heavy_check_mark:                  |               :heavy_check_mark:                |          | :thought_balloon: |

### No exceptions

| Name                                     | Description                                           | <span title="Recommended">:see_no_evil:</span> | <span title="Functional Lite">:hear_no_evil:</span> | <span title="Functional">:speak_no_evil:</span> | :wrench: | :blue_heart: |
| ---------------------------------------- | ----------------------------------------------------- | :--------------------------------------------: | :-------------------------------------------------: | :---------------------------------------------: | :------: | :----------: |
| [`no-throw`](./docs/rules/no-throw.md)   | Disallow throwing exceptions                          |                                                |                 :heavy_check_mark:                  |               :heavy_check_mark:                |          |              |
| [`no-try`](./docs/rules/no-try.md)       | Disallow try-catch[-finally] and try-finally patterns |                                                |                                                     |               :heavy_check_mark:                |          |              |
| [`no-reject`](./docs/rules/no-reject.md) | Disallow rejecting Promises                           |                                                |                                                     |                                                 |          |              |

### Currying

| Name                                                             | Description                              | <span title="Recommended">:see_no_evil:</span> | <span title="Functional Lite">:hear_no_evil:</span> | <span title="Functional">:speak_no_evil:</span> | :wrench: | :blue_heart: |
| ---------------------------------------------------------------- | ---------------------------------------- | :--------------------------------------------: | :-------------------------------------------------: | :---------------------------------------------: | :------: | :----------: |
| [`functional-parameters`](./docs/rules/functional-parameters.md) | Functions must have functional parameter |                                                |                 :heavy_check_mark:                  |               :heavy_check_mark:                |          |              |

## Recommended standard rules

In addition to the immutability rules above, there are a few standard rules that needs to be enabled to achieve immutability.

Each of these rules are enabled by default in the rulesets this plugin provides.

### [no-var](https://eslint.org/docs/rules/no-var)

Without this rule, it is still possible to create `var` variables that are mutable.

### [no-param-reassign](https://eslint.org/docs/rules/no-param-reassign)

Without this rule, function parameters are mutable.

### [prefer-const](https://eslint.org/docs/rules/no-param-reassign)

This rule is helpful when converting from an imperative code style to a functional one.

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

In order to know which AST nodes are created for a snippet of TypeScript code you can use [ast explorer](https://astexplorer.net/) with options JavaScript and @typescript-eslint/parser.

## How to publish

```
yarn version --patch
yarn version --minor
yarn version --major
```

## Prior work

This project started off as a port of [tslint-immutable](https://github.com/jonaskello/tslint-immutable) which was originally inspired by [eslint-plugin-immutable](https://github.com/jhusain/eslint-plugin-immutable).

[version-image]: https://img.shields.io/npm/v/eslint-plugin-functional.svg?style=flat
[version-url]: https://www.npmjs.com/package/eslint-plugin-functional
[travis-image]: https://travis-ci.com/jonaskello/eslint-plugin-functional.svg?branch=master&style=flat
[travis-url]: https://travis-ci.com/jonaskello/eslint-plugin-functional
[codecov-image]: https://codecov.io/gh/jonaskello/eslint-plugin-functional/branch/master/graph/badge.svg
[codecov-url]: https://codecov.io/gh/jonaskello/eslint-plugin-functional
[license-image]: https://img.shields.io/github/license/jonaskello/eslint-plugin-functional.svg?style=flat
[license-url]: https://opensource.org/licenses/MIT
[prettier-image]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat
[prettier-url]: https://github.com/prettier/prettier
[type-info-badge]: https://img.shields.io/badge/type_info-required-d51313.svg?style=flat
[type-info-url]: https://palantir.github.io/tslint/usage/type-checking
