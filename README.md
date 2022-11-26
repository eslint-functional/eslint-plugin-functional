<div align="center">

![eslint-logo](docs/assets/eslint-functional-logo.png?sanitize=true)

# eslint-plugin-functional

[![npm version](https://img.shields.io/npm/v/eslint-plugin-functional.svg?style=flat)](https://www.npmjs.com/package/eslint-plugin-functional)
[![CI](https://github.com/eslint-functional/eslint-plugin-functional/actions/workflows/ci.yml/badge.svg)](https://github.com/eslint-functional/eslint-plugin-functional/actions/workflows/ci.yml)
[![Coverage Status](https://codecov.io/gh/eslint-functional/eslint-plugin-functional/branch/main/graph/badge.svg)](https://codecov.io/gh/eslint-functional/eslint-plugin-functional)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat)](https://github.com/semantic-release/semantic-release)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat)](https://github.com/prettier/prettier)
[![MIT license](https://img.shields.io/github/license/eslint-functional/eslint-plugin-functional.svg?style=flat)](https://opensource.org/licenses/MIT)
[![GitHub Discussions](https://img.shields.io/github/discussions/eslint-functional/eslint-plugin-functional)](https://github.com/eslint-functional/eslint-plugin-functional/discussions)

An [ESLint](http://eslint.org) plugin to disable mutation and promote functional programming in JavaScript and TypeScript.

</div>

## Rulesets

The following rulesets are made available by this plugin:

Presets:

- **Strict** (`plugin:functional/strict`)\
  Enforce recommended rules designed to strictly enforce functional programming.

- **Recommended** (`plugin:functional/recommended`)\
  Has the same goal as the `strict` preset but a little more lenient, allowing for functional-like coding styles and nicer integration with non-functional 3rd-party libraries.

- **Lite** (`plugin:functional/lite`)\
  Good if you're new to functional programming or are converting a large codebase.

Categorized:

- **Currying** (`plugin:functional/currying`)\
  JavaScript functions support syntax that is not compatible with curried functions. To enforce currying, this syntax should be prevented.

- **No Exceptions** (`plugin:functional/no-exceptions`)\
  Functional programming style does not use run-time exceptions. Instead expressions produces values to indicate errors.

- **No Mutations** (`plugin:functional/no-mutations`)\
  Prevent mutating any data as that's not functional

- **No Other Paradigms** (`plugin:functional/no-other-paradigms`)\
  JavaScript is multi-paradigm, allowing not only functional, but object-oriented as well as other programming styles. To promote a functional style, prevent the use of other paradigm styles.

- **No Statements** (`plugin:functional/no-statements`)\
  In functional programming everything is an expression that produces a value. JavaScript has a lot of syntax that is just statements that does not produce a value. That syntax has to be prevented to promote a functional style.

- **Stylistic** (`plugin:functional/stylistic`)\
  Enforce code styles that can be considered to be more functional.

Other:

- **All** (`plugin:functional/all`)\
  Enables all rules defined in this plugin.

- **Off** (`plugin:functional/off`)\
  Disable all rules defined in this plugin.

- **External Vanilla Recommended** (`plugin:functional/external-vanilla-recommended`)\
  Configures recommended [vanilla ESLint](https://www.npmjs.com/package/eslint) rules.

- **External Typescript Recommended** (`plugin:functional/external-typescript-recommended`)\
  Configures recommended [TypeScript ESLint](https://www.npmjs.com/package/@typescript-eslint/eslint-plugin) rules. Enabling this ruleset will also enable the vanilla one.

The [below section](#rules) gives details on which rules are enabled by each ruleset.

## Rules

### No Mutations Rules

| Name                                                                             | Description                                    | <span title="No Mutations">:fleur_de_lis:</span> | <span title="Strict">:speak_no_evil:</span> | <span title="Recommended">:see_no_evil:</span> | <span title="Lite">:hear_no_evil:</span> | :wrench: |   :blue_heart:    |
| -------------------------------------------------------------------------------- | ---------------------------------------------- | :----------------------------------------------: | :-----------------------------------------: | :--------------------------------------------: | :--------------------------------------: | :------: | :---------------: |
| [`immutable-data`](./docs/rules/immutable-data.md)                               | Disallow mutating objects and arrays           |                :heavy_check_mark:                |             :heavy_check_mark:              |               :heavy_check_mark:               |              :green_circle:              |          |   :blue_heart:    |
| [`no-let`](./docs/rules/no-let.md)                                               | Disallow mutable variables                     |                :heavy_check_mark:                |             :heavy_check_mark:              |                 :green_circle:                 |              :green_circle:              |          |                   |
| [`prefer-immutable-types`](./docs/rules/prefer-immutable-types.md)               | Require types of data to be immutable          |                :heavy_check_mark:                |             :heavy_check_mark:              |                 :green_circle:                 |              :green_circle:              | :wrench: | :thought_balloon: |
| [`type-declaration-immutability`](./docs/rules/type-declaration-immutability.md) | Enforce type alias immutability using patterns |                :heavy_check_mark:                |             :heavy_check_mark:              |               :heavy_check_mark:               |            :heavy_check_mark:            |          | :thought_balloon: |

### No Other Paradigms Rules

| Name                                                         | Description                                                        | <span title="No Other Paradigms">:fleur_de_lis:</span> | <span title="Strict">:speak_no_evil:</span> | <span title="Recommended">:see_no_evil:</span> | <span title="Lite">:hear_no_evil:</span> | :wrench: |   :blue_heart:    |
| ------------------------------------------------------------ | ------------------------------------------------------------------ | :----------------------------------------------------: | :-----------------------------------------: | :--------------------------------------------: | :--------------------------------------: | :------: | :---------------: |
| [`no-classes`](./docs/rules/no-classes.md)                   | Disallow classes                                                   |                   :heavy_check_mark:                   |             :heavy_check_mark:              |               :heavy_check_mark:               |            :heavy_check_mark:            |          |                   |
| [`no-mixed-types`](./docs/rules/no-mixed-types.md)           | Disallow types that contain both callable and non-callable members |                   :heavy_check_mark:                   |             :heavy_check_mark:              |               :heavy_check_mark:               |            :heavy_check_mark:            |          | :thought_balloon: |
| [`no-this-expressions`](./docs/rules/no-this-expressions.md) | Disallow `this` access                                             |                   :heavy_check_mark:                   |             :heavy_check_mark:              |                                                |                                          |          |                   |

### No Statements Rules

| Name                                                                     | Description                                                    | <span title="No Statements">:fleur_de_lis:</span> | <span title="Strict">:speak_no_evil:</span> | <span title="Recommended">:see_no_evil:</span> | <span title="Lite">:hear_no_evil:</span> | :wrench: |   :blue_heart:    |
| ------------------------------------------------------------------------ | -------------------------------------------------------------- | :-----------------------------------------------: | :-----------------------------------------: | :--------------------------------------------: | :--------------------------------------: | :------: | :---------------: |
| [`no-conditional-statements`](./docs/rules/no-conditional-statements.md) | Disallow conditional statements (`if` and `switch` statements) |                :heavy_check_mark:                 |             :heavy_check_mark:              |                 :green_circle:                 |                                          |          | :thought_balloon: |
| [`no-expression-statements`](./docs/rules/no-expression-statements.md)   | Disallow expressions to cause side-effects                     |                :heavy_check_mark:                 |             :heavy_check_mark:              |                                                |                                          |          | :thought_balloon: |
| [`no-loop-statements`](./docs/rules/no-loop-statements.md)               | Disallow imperative loops                                      |                :heavy_check_mark:                 |             :heavy_check_mark:              |               :heavy_check_mark:               |            :heavy_check_mark:            |          |                   |
| [`no-return-void`](./docs/rules/no-return-void.md)                       | Disallow functions that return nothing                         |                :heavy_check_mark:                 |             :heavy_check_mark:              |               :heavy_check_mark:               |            :heavy_check_mark:            |          | :thought_balloon: |

### No Exceptions Rules

| Name                                                         | Description                                           | <span title="No Exceptions">:fleur_de_lis:</span> | <span title="Strict">:speak_no_evil:</span> | <span title="Recommended">:see_no_evil:</span> | <span title="Lite">:hear_no_evil:</span> | :wrench: | :blue_heart: |
| ------------------------------------------------------------ | ----------------------------------------------------- | :-----------------------------------------------: | :-----------------------------------------: | :--------------------------------------------: | :--------------------------------------: | :------: | :----------: |
| [`no-promise-reject`](./docs/rules/no-promise-reject.md)     | Disallow rejecting Promises                           |                                                   |                                             |                                                |                                          |          |              |
| [`no-throw-statements`](./docs/rules/no-throw-statements.md) | Disallow throwing exceptions                          |                :heavy_check_mark:                 |             :heavy_check_mark:              |                 :green_circle:                 |              :green_circle:              |          |              |
| [`no-try-statements`](./docs/rules/no-try-statements.md)     | Disallow try-catch[-finally] and try-finally patterns |                :heavy_check_mark:                 |             :heavy_check_mark:              |                                                |                                          |          |              |

### Currying Rules

| Name                                                             | Description                               | <span title="Currying">:fleur_de_lis:</span> | <span title="Strict">:speak_no_evil:</span> | <span title="Recommended">:see_no_evil:</span> | <span title="Lite">:hear_no_evil:</span> | :wrench: | :blue_heart: |
| ---------------------------------------------------------------- | ----------------------------------------- | :------------------------------------------: | :-----------------------------------------: | :--------------------------------------------: | :--------------------------------------: | :------: | :----------: |
| [`functional-parameters`](./docs/rules/functional-parameters.md) | Functions must have functional parameters |              :heavy_check_mark:              |             :heavy_check_mark:              |                 :green_circle:                 |              :green_circle:              |          |              |

### Stylistic Rules

| Name                                                                       | Description                                                             | <span title="Stylistic">:fleur_de_lis:</span> | <span title="Strict">:speak_no_evil:</span> | <span title="Recommended">:see_no_evil:</span> | <span title="Lite">:hear_no_evil:</span> | :wrench: |   :blue_heart:    |
| -------------------------------------------------------------------------- | ----------------------------------------------------------------------- | :-------------------------------------------: | :-----------------------------------------: | :--------------------------------------------: | :--------------------------------------: | :------: | :---------------: |
| [`prefer-property-signatures`](./docs/rules/prefer-property-signatures.md) | Enforce property signatures over method signatures                      |              :heavy_check_mark:               |                                             |                                                |                                          |          | :thought_balloon: |
| [`prefer-tacit`](./docs/rules/prefer-tacit.md)                             | Tacit/Point-Free style.                                                 |              :heavy_check_mark:               |                                             |                                                |                                          | :wrench: |   :blue_heart:    |
| [`readonly-type`](./docs/rules/readonly-type.md)                           | Require consistently using either `readonly` keywords or `Readonly<T>`. |              :heavy_check_mark:               |                                             |                                                |                                          | :wrench: | :thought_balloon: |

### Key

|       Symbol       | Meaning                                                                                                                          |
| :----------------: | -------------------------------------------------------------------------------------------------------------------------------- |
|   :fleur_de_lis:   | Ruleset: Current                                                                                                                 |
|  :speak_no_evil:   | Ruleset: Strict                                                                                                                  |
|   :see_no_evil:    | Ruleset: Recommended                                                                                                             |
|   :hear_no_evil:   | Ruleset: Lite                                                                                                                    |
| :heavy_check_mark: | Enabled as Error                                                                                                                 |
|   :green_circle:   | Enabled as Error with Overrides                                                                                                  |
|      :wrench:      | Fixable                                                                                                                          |
| :thought_balloon:  | Only Available for TypeScript                                                                                                    |
|    :blue_heart:    | <span title="Type Information will be used if available making the rule work in more cases.">Works better with TypeScript</span> |

<!--
|    :warning:    | Enabled as Warning                |
| :yellow_circle: | Enabled as Warning with Overrides |
-->

## External Recommended Rules

In addition to the above rules, there are a few other rules we recommended.

These rules are what are included in the _external recommended_ rulesets.

### Vanilla Rules

- [no-var](https://eslint.org/docs/rules/no-var)\
  Without this rule, it is still possible to create `var` variables that are mutable.

- [no-param-reassign](https://eslint.org/docs/rules/no-param-reassign)\
  Don't allow function parameters to be reassigned, they should be treated as constants.

- [prefer-const](https://eslint.org/docs/rules/prefer-const)\
  This rule provides a helpful fixer when converting from an imperative code style to a functional one.

### Typescript Rules

- [@typescript-eslint/prefer-readonly](https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/docs/rules/prefer-readonly.md)\
  This rule is helpful when working with classes.

- [@typescript-eslint/switch-exhaustiveness-check](https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/docs/rules/switch-exhaustiveness-check.md)\
  Although our [no-conditional-statements](./docs/rules/no-conditional-statements.md) rule also performs this check, this rule has a fixer that will implement the unimplemented cases which can be useful.

## Prior work

This project started off as a port of [tslint-immutable](https://github.com/jonaskello/tslint-immutable) which was originally inspired by [eslint-plugin-immutable](https://github.com/jhusain/eslint-plugin-immutable).
