<div align="center">

![eslint-logo](docs/assets/eslint-logo.svg?sanitize=true)

# eslint-plugin-functional

[![npm version](https://img.shields.io/npm/v/eslint-plugin-functional.svg?style=flat)](https://www.npmjs.com/package/eslint-plugin-functional)
[![CI](https://github.com/jonaskello/eslint-plugin-functional/actions/workflows/ci.yml/badge.svg)](https://github.com/jonaskello/eslint-plugin-functional/actions/workflows/ci.yml)
[![Coverage Status](https://codecov.io/gh/jonaskello/eslint-plugin-functional/branch/master/graph/badge.svg)](https://codecov.io/gh/jonaskello/eslint-plugin-functional)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat)](https://github.com/semantic-release/semantic-release)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat)](https://github.com/prettier/prettier)
[![MIT license](https://img.shields.io/github/license/jonaskello/eslint-plugin-functional.svg?style=flat)](https://opensource.org/licenses/MIT)
[![GitHub Discussions](https://img.shields.io/github/discussions/jonaskello/eslint-plugin-functional)](https://github.com/jonaskello/eslint-plugin-functional/discussions)

An [ESLint](http://eslint.org) plugin to disable mutation and promote functional programming in JavaScript and TypeScript.

</div>

> :wave: If you previously used the rules in [tslint-immutable](https://www.npmjs.com/package/tslint-immutable), this package is the ESLint version of those rules. Please see the [migration guide](docs/user-guide/migrating-from-tslint.md) for how to migrate.

## Features

- [No mutations](#no-mutations)
- [No object-orientation](#no-object-orientation)
- [No statements](#no-statements)
- [No exceptions](#no-exceptions)
- [Currying](#currying)
- [Stylistic](#stylistic)

### No mutations

One aim of this project is to leverage the type system in TypeScript to enforce immutability at compile-time while still using regular objects and arrays. Additionally, this project will also aim to support disabling mutability for vanilla JavaScript where possible.

### No object-orientation

JavaScript is multi-paradigm, allowing both object-oriented and functional programming styles. In order to promote a functional style, the object oriented features of JavaScript need to be disabled.

### No statements

In functional programming everything is an expression that produces a value. JavaScript has a lot of syntax that is just statements that does not produce a value. That syntax has to be disabled to promote a functional style.

### No exceptions

Functional programming style does not use run-time exceptions. Instead expressions produces values to indicate errors.

### Currying

JavaScript functions support syntax that is not compatible with curried functions. To enable currying this syntax has to be disabled.

### Stylistic

Enforce code to be written in a more functional style.

## Installation

### JavaScript

```sh
# Install with npm
npm install -D eslint eslint-plugin-functional

# Install with yarn
yarn add -D eslint eslint-plugin-functional
```

### TypeScript

```sh
# Install with npm
npm install -D eslint @typescript-eslint/parser tsutils eslint-plugin-functional

# Install with yarn
yarn add -D eslint @typescript-eslint/parser tsutils eslint-plugin-functional
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
    "plugin:functional/recommended",
    "plugin:functional/stylistic"
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
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:functional/external-recommended",
    "plugin:functional/recommended",
    "plugin:functional/stylistic"
  ]
}
```

## Rulesets

The following rulesets are made available by this plugin:

Presets:

- **Recommended** (plugin:functional/recommended)
- **Lite** (plugin:functional/lite)
- **Off** (plugin:functional/off)

Categorized:

- **No Mutations** (plugin:functional/no-mutations)
- **No Object Orientation** (plugin:functional/no-object-orientation)
- **No Statements** (plugin:functional/no-statements)
- **No Exceptions** (plugin:functional/no-exceptions)
- **Currying** (plugin:functional/currying)
- **Stylistic** (plugin:functional/stylistic)

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
| :thought_balloon: | Only Available for TypeScript<br><sub><sup>The rule either requires Type Information or only works with TypeScript syntax.</sup></sub> |
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

| Name                                                       | Description                                                              | <span title="No Object-Orientation">:see_no_evil:</span> | <span title="Lite">:hear_no_evil:</span> | <span title="Recommended">:speak_no_evil:</span> | :wrench: |   :blue_heart:    |
| ---------------------------------------------------------- | ------------------------------------------------------------------------ | :------------------------------------------------------: | :--------------------------------------: | :----------------------------------------------: | :------: | :---------------: |
| [`no-class`](./docs/rules/no-class.md)                     | Disallow classes                                                         |                    :heavy_check_mark:                    |            :heavy_check_mark:            |                :heavy_check_mark:                |          |                   |
| [`no-mixed-type`](./docs/rules/no-mixed-type.md)           | Restrict types so that only members of the same kind are allowed in them |                    :heavy_check_mark:                    |            :heavy_check_mark:            |                :heavy_check_mark:                |          | :thought_balloon: |
| [`no-this-expression`](./docs/rules/no-this-expression.md) | Disallow `this` access                                                   |                    :heavy_check_mark:                    |            :heavy_check_mark:            |                :heavy_check_mark:                |          |                   |

### No Statements Rules

:see_no_evil: = `no-statements` Ruleset.

| Name                                                                   | Description                                                | <span title="No Statements">:see_no_evil:</span> | <span title="Lite">:hear_no_evil:</span> | <span title="Recommended">:speak_no_evil:</span> | :wrench: |   :blue_heart:    |
| ---------------------------------------------------------------------- | ---------------------------------------------------------- | :----------------------------------------------: | :--------------------------------------: | :----------------------------------------------: | :------: | :---------------: |
| [`no-conditional-statement`](./docs/rules/no-conditional-statement.md) | Disallow conditional statements (if and switch statements) |                :heavy_check_mark:                |                                          |                :heavy_check_mark:                |          | :thought_balloon: |
| [`no-expression-statement`](./docs/rules/no-expression-statement.md)   | Disallow expressions to cause side-effects                 |                :heavy_check_mark:                |                                          |                :heavy_check_mark:                |          | :thought_balloon: |
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

### Stylistic Rules

:see_no_evil: = `stylistic` Ruleset.

| Name                                           | Description             | <span title="Stylistic">:see_no_evil:</span> | <span title="Lite">:hear_no_evil:</span> | <span title="Recommended">:speak_no_evil:</span> | :wrench: |   :blue_heart:    |
| ---------------------------------------------- | ----------------------- | :------------------------------------------: | :--------------------------------------: | :----------------------------------------------: | :------: | :---------------: |
| [`prefer-tacit`](./docs/rules/prefer-tacit.md) | Tacit/Point-Free style. |              :heavy_check_mark:              |            :heavy_check_mark:            |                :heavy_check_mark:                | :wrench: | :thought_balloon: |

## Recommended standard rules

In addition to the immutability rules above, there are a few standard rules that need to be enabled to achieve immutability.

These rules are all included in the _external-recommended_ rulesets.

### [no-var](https://eslint.org/docs/rules/no-var)

Without this rule, it is still possible to create `var` variables that are mutable.

### [no-param-reassign](https://eslint.org/docs/rules/no-param-reassign)

Without this rule, function parameters are mutable.

### [prefer-const](https://eslint.org/docs/rules/prefer-const)

This rule is helpful when converting from an imperative code style to a functional one.

### [@typescript-eslint/prefer-readonly](https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/prefer-readonly.md)

This rule is helpful when working with classes.

### [@typescript-eslint/prefer-readonly-parameter-types](https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/prefer-readonly-parameter-types.md)

Functional functions must not modify any data passed into them.
This rule marks mutable parameters as a violation as they prevent readonly versions of that data from being passed in.

However, due to many 3rd-party libraries only providing mutable versions of their types, often it can not be easy to satisfy this rule. Thus by default we only enable this rule with the "warn" severity rather than "error".

### [@typescript-eslint/switch-exhaustiveness-check](https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/switch-exhaustiveness-check.md)

Although our [no-conditional-statement](./docs/rules/no-conditional-statement.md) rule also performs this check, this rule has a fixer that will implement the unimplemented cases which can be useful.

## How to contribute

For new features file an issue. For bugs, file an issue and optionally file a PR with a failing test.

## How to develop

To execute the tests run `yarn test`.

To learn about ESLint plugin development see the [relevant section](https://eslint.org/docs/developer-guide/working-with-plugins) of the ESLint docs. You can also checkout the [typescript-eslint](https://github.com/typescript-eslint/typescript-eslint) repo which has some more information specific to TypeScript.

In order to know which AST nodes are created for a snippet of TypeScript code you can use [AST explorer](https://astexplorer.net/) with options JavaScript and @typescript-eslint/parser.

### Commit Messages

> tl;dr: use `npx cz` instead of `git commit`.

Commit messages must follow [Conventional Commit messages guidelines](https://www.conventionalcommits.org/en/v1.0.0/). You can use `npx cz` instead of `git commit` to run a interactive prompt to generate the commit message. We've customize the prompt specifically for this project. For more information see [commitizen](https://github.com/commitizen/cz-cli#readme).

### How to publish

Publishing is handled by [semantic release](https://github.com/semantic-release/semantic-release#readme) - there shouldn't be any need to publish manually.

## Prior work

This project started off as a port of [tslint-immutable](https://github.com/jonaskello/tslint-immutable) which was originally inspired by [eslint-plugin-immutable](https://github.com/jhusain/eslint-plugin-immutable).
