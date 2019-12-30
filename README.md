<div align="center">
  <svg width="150" height="132" viewBox="0 0 256 225" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid"><path d="M77.965 80.568l48.57-28.042a3.929 3.929 0 0 1 3.93 0l48.57 28.042A3.932 3.932 0 0 1 181 83.971v56.084c0 1.403-.75 2.7-1.965 3.403l-48.57 28.042a3.929 3.929 0 0 1-3.93 0l-48.57-28.042A3.931 3.931 0 0 1 76 140.055V83.97c.001-1.404.75-2.7 1.965-3.403" fill="#8080F2"/><path d="M254.417 107.417L196.323 6.35C194.213 2.696 190.315 0 186.095 0H69.906c-4.22 0-8.12 2.696-10.23 6.35L1.583 107.194c-2.11 3.655-2.11 8.268 0 11.923l58.093 100.239c2.11 3.654 6.01 5.522 10.23 5.522h116.188c4.22 0 8.119-1.812 10.228-5.467l58.094-100.402c2.112-3.653 2.112-7.938 0-11.592zm-48.105 48.6c0 1.485-.894 2.86-2.182 3.604l-73.999 42.693a4.21 4.21 0 0 1-4.186 0l-74.056-42.693c-1.287-.744-2.188-2.118-2.188-3.605V70.628c0-1.487.888-2.86 2.176-3.604l73.995-42.694a4.202 4.202 0 0 1 4.185 0l74.06 42.694c1.289.744 2.195 2.117 2.195 3.604v85.388z" fill="#4B32C3"/></svg>

  <h1>eslint-plugin-functional</h1>
  <p>
    <a href="https://www.npmjs.com/package/eslint-plugin-functional"><img alt="npm version" src="https://img.shields.io/npm/v/eslint-plugin-functional.svg?style=flat"></a>
    <a href="https://travis-ci.com/jonaskello/eslint-plugin-functional"><img alt="travis build" src="https://travis-ci.com/jonaskello/eslint-plugin-functional.svg?branch=master&amp;style=flat"></a>
    <a href="https://codecov.io/gh/jonaskello/eslint-plugin-functional"><img alt="Coverage Status" src="https://codecov.io/gh/jonaskello/eslint-plugin-functional/branch/master/graph/badge.svg"></a>
    <a href="https://github.com/prettier/prettier"><img alt="code style: prettier" src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat"></a>
    <a href="https://opensource.org/licenses/MIT"><img alt="MIT license" src="https://img.shields.io/github/license/jonaskello/eslint-plugin-functional.svg?style=flat"></a>
    <a href="https://spectrum.chat/eslint-functional"><img alt="Join the community on Spectrum" src="https://withspectrum.github.io/badge/badge.svg"></a>
  </p>
  <p>An <a href="http://eslint.org">ESLint</a> plugin to disable mutation and promote functional programming in JavaScript and TypeScript.</p>
</div>

> :wave: If you previously used the rules in [tslint-immutable](https://www.npmjs.com/package/tslint-immutable), this package is the eslint version of those rules. Please see the [migration guide](docs/user-guide/migrating-from-tslint.md) for how to migrate.

## Features

- [No mutations](#no-mutations)
- [No object-orientation](#no-object-orientation)
- [No statements](#no-statements)
- [No exceptions](#no-exceptions)
- [Currying](#currying)

### No mutations

One aim of this project is to leverage the type system in TypeScript to enforce immutability at compile-time while still using regular objects and arrays. Additionally, this project will also aim to support disabling mutability for vanilla JavaScript where possible.

### No object-orientation

JavaScript is multi-paradigm, allowing both object-oriented and functional programming styles. In order to promote a functional style, the object oriented features of JavaScript need to be disabled.

### No statements

In functional programming everything is an expression that produces a value. Javascript has a lot of syntax that is just statements that does not produce a value. That syntax has to be disabled to promote a functional style.

### No exceptions

Functional programming style does not use run-time exceptions. Instead expressions produces values to indicate errors.

### Currying

Javascript functions support syntax that is not compatible with curried functions. To enable currying this syntax has to be disabled.

## Installation

### JavaScript

```sh
# Install with npm
npm install eslint eslint-plugin-functional --save-dev

# Install with yarn
yarn add -D eslint eslint-plugin-functional
```

**Note:** If you installed ESLint globally (using the `-g` flag with npm or `global` with yarn) then you must also install `eslint-plugin-functional` globally.

### TypeScript

To use this plugin with TypeScript, a TypeScript parser for eslint is needed.
We recommend [@typescript-eslint/parser](https://www.npmjs.com/package/@typescript-eslint/parser).

```sh
# Install with npm
npm install eslint @typescript-eslint/parser eslint-plugin-functional --save-dev

# Install with yarn
yarn add -D eslint @typescript-eslint/parser eslint-plugin-functional
```

## Usage

Add `functional` to the plugins section of your `.eslintrc` configuration file. Then configure the rules you want to use under the rules section.

```jsonc
{
  "plugins": ["functional"],
  "rules": {
    "functional/rule-name": "error"
  }
}
```

There are several rulesets provided by this plugin.
[See below](#rulesets) for what they are and what rules are including in each.
Enable rulesets via the "extends" property of your `.eslintrc` configuration file.

```jsonc
{
  // ...
  "extends": [
    "plugin:functional/external-recommended",
    "plugin:functional/recommended"
  ]
}
```

### With TypeScript

Add `@typescript-eslint/parser` to the "parser" filed in your `.eslintrc` configuration file.  
To use type information, you will need to specify a path to your `tsconfig.json` file in the "project" property of "parserOptions".

```jsonc
{
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": "./tsconfig.json"
  }
}
```

See [@typescript-eslint/parser's README.md](https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/parser#readme) for more information on the available parser options.

### Example Config

```jsonc
{
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": "tsconfig.json"
  },
  "env": {
    "es6": true
  },
  "plugins": [
    "@typescript-eslint",
    "functional"
  ],
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:functional/external-recommended",
    "plugin:functional/recommended"
  ]
}
```

**Note: Make sure to use `eslint --ext .js,.ts` since by [default](https://eslint.org/docs/user-guide/command-line-interface#--ext) `eslint` will only search for .js files.**

## Rulesets

The following rulesets are made available by this plugin:

Presets:

- **Recommended** (plugin:functional/recommended)
- **Lite** (plugin:functional/lite)

Categorized:

- **No Mutations** (plugin:functional/no-mutations)
- **No Object Orientation** (plugin:functional/no-object-orientation)
- **No Statements** (plugin:functional/no-statements)
- **No Exceptions** (plugin:functional/no-exceptions)
- **Currying** (plugin:functional/currying)

Other:

- **All** (plugin:functional/all) - Enables all rules defined in this plugin.
- **External Recommended** (plugin:functional/external-recommended) - Configures recommended rules not defined by this plugin.

The [below section](#supported-rules) gives details on which rules are enabled by each ruleset.

## Supported Rules

**Key**:

|      Symbol       | Meaning                                                                                                                                |
| :---------------: | -------------------------------------------------------------------------------------------------------------------------------------- |
|  :hear_no_evil:   | Ruleset: Lite<br><sub><sup>This ruleset is designed to enforce a somewhat functional programming code style.</sup></sub>               |
|  :speak_no_evil:  | Ruleset: Recommended<br><sub><sup>This ruleset is designed to enforce a functional programming code style.</sup></sub>                 |
|     :wrench:      | Fixable<br><sub><sup>Problems found by this rule are potentially fixable with the `--fix` option.</sup></sub>                          |
| :thought_balloon: | Only Avaliable for TypeScript<br><sub><sup>The rule either requires Type Information or only works with TypeScript syntax.</sup></sub> |
|   :blue_heart:    | Works better with TypeScript<br><sub><sup>Type Information will be used if available making the rule work in more cases.</sup></sub>   |

### No Mutations Rules

:see_no_evil: = `no-mutations` Ruleset.

| Name                                                           | Description                                                                | <span title="No Mutations">:see_no_evil:</span> | <span title="Lite">:hear_no_evil:</span> | <span title="Recommended">:speak_no_evil:</span> | :wrench: |   :blue_heart:    |
| -------------------------------------------------------------- | -------------------------------------------------------------------------- | :---------------------------------------------: | :--------------------------------------: | :----------------------------------------------: | :------: | :---------------: |
| [`immutable-data`](./docs/rules/immutable-data.md)             | Disallow mutating objects and arrays                                       |               :heavy_check_mark:                |            :heavy_check_mark:            |                :heavy_check_mark:                |          |   :blue_heart:    |
| [`no-let`](./docs/rules/no-let.md)                             | Disallow mutable variables                                                 |               :heavy_check_mark:                |            :heavy_check_mark:            |                :heavy_check_mark:                |          |                   |
| [`no-method-signature`](./docs/rules/no-method-signature.md)   | Enforce property signatures with readonly modifiers over method signatures |               :heavy_check_mark:                |            :heavy_check_mark:            |                :heavy_check_mark:                |          | :thought_balloon: |
| [`prefer-readonly-type`](./docs/rules/prefer-readonly-type.md) | Use readonly types and readonly modifiers where possible                   |               :heavy_check_mark:                |            :heavy_check_mark:            |                :heavy_check_mark:                | :wrench: | :thought_balloon: |

### No Object-Orientation Rules

:see_no_evil: = `no-object-orientation` Ruleset.

| Name                                                         | Description                                                              | <span title="No Object-Orientation">:see_no_evil:</span> | <span title="Lite">:hear_no_evil:</span> | <span title="Recommended">:speak_no_evil:</span> | :wrench: |   :blue_heart:    |
| ------------------------------------------------------------ | ------------------------------------------------------------------------ | :------------------------------------------------------: | :--------------------------------------: | :----------------------------------------------: | :------: | :---------------: |
| [`no-class`](./docs/rules/no-class.md)                       | Disallow classes                                                         |                    :heavy_check_mark:                    |            :heavy_check_mark:            |                :heavy_check_mark:                |          |                   |
| [`no-mixed-type`](./docs/rules/no-mixed-type.md)             | Restrict types so that only members of the same kind are allowed in them |                    :heavy_check_mark:                    |            :heavy_check_mark:            |                :heavy_check_mark:                |          | :thought_balloon: |
| [`no-this-expression`](./docs/rules/no-this-expression.md)   | Disallow `this` access                                                   |                    :heavy_check_mark:                    |            :heavy_check_mark:            |                :heavy_check_mark:                |          |                   |
| [`prefer-type-literal`](./docs/rules/prefer-type-literal.md) | Use type literals over interfaces                                        |                    :heavy_check_mark:                    |            :heavy_check_mark:            |                :heavy_check_mark:                |          | :thought_balloon: |

### No Statements Rules

:see_no_evil: = `no-statements` Ruleset.

| Name                                                                   | Description                                                | <span title="No Statements">:see_no_evil:</span> | <span title="Lite">:hear_no_evil:</span> | <span title="Recommended">:speak_no_evil:</span> | :wrench: |   :blue_heart:    |
| ---------------------------------------------------------------------- | ---------------------------------------------------------- | :----------------------------------------------: | :--------------------------------------: | :----------------------------------------------: | :------: | :---------------: |
| [`no-conditional-statement`](./docs/rules/no-conditional-statement.md) | Disallow conditional statements (if and switch statements) |                :heavy_check_mark:                |                                          |                :heavy_check_mark:                |          |                   |
| [`no-expression-statement`](./docs/rules/no-expression-statement.md)   | Disallow expressions to cause side-effects                 |                :heavy_check_mark:                |                                          |                :heavy_check_mark:                |          |                   |
| [`no-loop-statement`](./docs/rules/no-loop-statement.md)               | Disallow imperative loops                                  |                :heavy_check_mark:                |            :heavy_check_mark:            |                :heavy_check_mark:                |          |                   |
| [`no-return-void`](./docs/rules/no-return-void.md)                     | Disallow functions that return nothing                     |                :heavy_check_mark:                |            :heavy_check_mark:            |                :heavy_check_mark:                |          | :thought_balloon: |

### No Exceptions Rules

:see_no_evil: = `no-exceptions` Ruleset.

| Name                                                       | Description                                           | <span title="No Exceptions">:see_no_evil:</span> | <span title="Lite">:hear_no_evil:</span> | <span title="Recommended">:speak_no_evil:</span> | :wrench: | :blue_heart: |
| ---------------------------------------------------------- | ----------------------------------------------------- | :----------------------------------------------: | :--------------------------------------: | :----------------------------------------------: | :------: | :----------: |
| [`no-promise-reject`](./docs/rules/no-promise-reject.md)   | Disallow rejecting Promises                           |                                                  |                                          |                                                  |          |              |
| [`no-throw-statement`](./docs/rules/no-throw-statement.md) | Disallow throwing exceptions                          |                :heavy_check_mark:                |            :heavy_check_mark:            |                :heavy_check_mark:                |          |              |
| [`no-try-statement`](./docs/rules/no-try-statement.md)     | Disallow try-catch[-finally] and try-finally patterns |                :heavy_check_mark:                |                                          |                :heavy_check_mark:                |          |              |

### Currying Rules

:see_no_evil: = `currying` Ruleset.

| Name                                                             | Description                               | <span title="Currying">:see_no_evil:</span> | <span title="Lite">:hear_no_evil:</span> | <span title="Recommended">:speak_no_evil:</span> | :wrench: | :blue_heart: |
| ---------------------------------------------------------------- | ----------------------------------------- | :-----------------------------------------: | :--------------------------------------: | :----------------------------------------------: | :------: | :----------: |
| [`functional-parameters`](./docs/rules/functional-parameters.md) | Functions must have functional parameters |             :heavy_check_mark:              |            :heavy_check_mark:            |                :heavy_check_mark:                |          |              |

## Recommended standard rules

In addition to the immutability rules above, there are a few standard rules that need to be enabled to achieve immutability.

Each of these rules are enabled by default in the rulesets this plugin provides.

### [no-var](https://eslint.org/docs/rules/no-var)

Without this rule, it is still possible to create `var` variables that are mutable.

### [no-param-reassign](https://eslint.org/docs/rules/no-param-reassign)

Without this rule, function parameters are mutable.

### [prefer-const](https://eslint.org/docs/rules/no-param-reassign)

This rule is helpful when converting from an imperative code style to a functional one.

### [@typescript-eslint/explicit-function-return-type](https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/explicit-function-return-type.md)

For performance reasons, eslint-plugin-functional does not check implicit return types. So for example this function will return a mutable array but will not be detected:

```js
function foo() {
  return [1, 2, 3];
}
```

To avoid this situation you can enable `@typescript-eslint/explicit-function-return-type`. Now the above function is forced to declare the return type and the mutability will be detected.

## How to contribute

For new features file an issue. For bugs, file an issue and optionally file a PR with a failing test.

## How to develop

To execute the tests run `yarn test`.

To learn about eslint plugin development see the [relevant section](https://eslint.org/docs/developer-guide/working-with-plugins) of the eslint docs. You can also checkout the [typescript-eslint](https://github.com/typescript-eslint/typescript-eslint) repo which has some more information specific to typescript.

In order to know which AST nodes are created for a snippet of TypeScript code you can use [ast explorer](https://astexplorer.net/) with options JavaScript and @typescript-eslint/parser.

## How to publish

```
yarn version --patch
yarn version --minor
yarn version --major
```

## Prior work

This project started off as a port of [tslint-immutable](https://github.com/jonaskello/tslint-immutable) which was originally inspired by [eslint-plugin-immutable](https://github.com/jhusain/eslint-plugin-immutable).
