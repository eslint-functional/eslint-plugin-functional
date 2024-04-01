<div align="center">

![eslint-logo](docs/assets/eslint-functional-logo.png?sanitize=true)

# eslint-plugin-functional

[![npm version](https://img.shields.io/npm/v/eslint-plugin-functional.svg?style=flat)](https://www.npmjs.com/package/eslint-plugin-functional)
[![Release](https://github.com/eslint-functional/eslint-plugin-functional/actions/workflows/release.yml/badge.svg)](https://github.com/eslint-functional/eslint-plugin-functional/actions/workflows/release.yml)
[![Coverage Status](https://codecov.io/gh/eslint-functional/eslint-plugin-functional/branch/main/graph/badge.svg)](https://codecov.io/gh/eslint-functional/eslint-plugin-functional)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat)](https://github.com/semantic-release/semantic-release)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat)](https://github.com/prettier/prettier)
[![MIT license](https://img.shields.io/github/license/eslint-functional/eslint-plugin-functional.svg?style=flat)](https://opensource.org/licenses/MIT)
[![GitHub Discussions](https://img.shields.io/github/discussions/eslint-functional/eslint-plugin-functional)](https://github.com/eslint-functional/eslint-plugin-functional/discussions)

An [ESLint](http://eslint.org) plugin to disable mutation and promote functional programming in JavaScript and TypeScript.

</div>

## Donate

[Any donations would be much appreciated](./DONATIONS.md). 😄

### Enterprise Users

`eslint-plugin-functional` is available as part of the Tidelift Subscription.

Tidelift is working with the maintainers of `eslint-plugin-functional` and a growing network of open source maintainers to ensure your open source software supply chain meets enterprise standards now and into the future.
[Learn more.](https://tidelift.com/subscription/pkg/npm-eslint-plugin-functional?utm_source=npm-eslint-plugin-functional&utm_medium=referral&utm_campaign=enterprise&utm_term=repo)

## Getting Started

[See our getting started guide](./GETTING_STARTED.md).

## Rulesets

The following rulesets are made available by this plugin.

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

- **Disable Type Checked** (`plugin:functional/disable-type-checked`)\
  Disable all rules that require type information.

- **External Vanilla Recommended** (`plugin:functional/external-vanilla-recommended`)\
  Configures recommended [vanilla ESLint](https://www.npmjs.com/package/eslint) rules.

- **External Typescript Recommended** (`plugin:functional/external-typescript-recommended`)\
  Configures recommended [TypeScript ESLint](https://www.npmjs.com/package/@typescript-eslint/eslint-plugin) rules.
  Enabling this ruleset will also enable the vanilla one.

The [below section](#rules) gives details on which rules are enabled by each ruleset.

## Rules

<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<!-- begin auto-generated rules list -->

💼 Configurations enabled in.\
⚠️ Configurations set to warn in.\
🚫 Configurations disabled in.\
☑️ Set in the `lite` configuration.\
✅ Set in the `recommended` configuration.\
🔒 Set in the `strict` configuration.\
🎨 Set in the `stylistic` configuration.\
🔧 Automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/user-guide/command-line-interface#--fix).\
💡 Manually fixable by [editor suggestions](https://eslint.org/docs/latest/use/core-concepts#rule-suggestions).\
💭 Requires [type information](https://typescript-eslint.io/linting/typed-linting).\
❌ Deprecated.

### Currying

| Name                                                         | Description                    | 💼                          | ⚠️ | 🚫 | 🔧 | 💡 | 💭 | ❌  |
| :----------------------------------------------------------- | :----------------------------- | :-------------------------- | :- | :- | :- | :- | :- | :- |
| [functional-parameters](docs/rules/functional-parameters.md) | Enforce functional parameters. | ☑️ ✅ 🔒 ![badge-currying][] |    |    |    |    |    |    |

### No Exceptions

| Name                                                     | Description                                            | 💼                               | ⚠️ | 🚫   | 🔧 | 💡 | 💭 | ❌  |
| :------------------------------------------------------- | :----------------------------------------------------- | :------------------------------- | :- | :--- | :- | :- | :- | :- |
| [no-promise-reject](docs/rules/no-promise-reject.md)     | Disallow rejecting promises.                           |                                  |    |      |    |    |    |    |
| [no-throw-statements](docs/rules/no-throw-statements.md) | Disallow throwing exceptions.                          | ☑️ ✅ 🔒 ![badge-no-exceptions][] |    |      |    |    |    |    |
| [no-try-statements](docs/rules/no-try-statements.md)     | Disallow try-catch[-finally] and try-finally patterns. | 🔒 ![badge-no-exceptions][]      |    | ☑️ ✅ |    |    |    |    |

### No Mutations

| Name                                                                         | Description                                                     | 💼                              | ⚠️ | 🚫 | 🔧 | 💡 | 💭 | ❌  |
| :--------------------------------------------------------------------------- | :-------------------------------------------------------------- | :------------------------------ | :- | :- | :- | :- | :- | :- |
| [immutable-data](docs/rules/immutable-data.md)                               | Enforce treating data as immutable.                             | ☑️ ✅ 🔒 ![badge-no-mutations][] |    |    |    |    | 💭 |    |
| [no-let](docs/rules/no-let.md)                                               | Disallow mutable variables.                                     | ☑️ ✅ 🔒 ![badge-no-mutations][] |    |    |    |    |    |    |
| [prefer-immutable-types](docs/rules/prefer-immutable-types.md)               | Require function parameters to be typed as certain immutability | ☑️ ✅ 🔒 ![badge-no-mutations][] |    |    | 🔧 | 💡 | 💭 |    |
| [prefer-readonly-type](docs/rules/prefer-readonly-type.md)                   | Prefer readonly types over mutable types.                       |                                 |    |    | 🔧 |    | 💭 | ❌  |
| [type-declaration-immutability](docs/rules/type-declaration-immutability.md) | Enforce the immutability of types based on patterns.            | ☑️ ✅ 🔒 ![badge-no-mutations][] |    |    | 🔧 | 💡 | 💭 |    |

### No Other Paradigms

| Name                                                     | Description                                                               | 💼                                    | ⚠️ | 🚫   | 🔧 | 💡 | 💭 | ❌  |
| :------------------------------------------------------- | :------------------------------------------------------------------------ | :------------------------------------ | :- | :--- | :- | :- | :- | :- |
| [no-classes](docs/rules/no-classes.md)                   | Disallow classes.                                                         | ☑️ ✅ 🔒 ![badge-no-other-paradigms][] |    |      |    |    |    |    |
| [no-mixed-types](docs/rules/no-mixed-types.md)           | Restrict types so that only members of the same kind are allowed in them. | ☑️ ✅ 🔒 ![badge-no-other-paradigms][] |    |      |    |    | 💭 |    |
| [no-this-expressions](docs/rules/no-this-expressions.md) | Disallow this access.                                                     | 🔒 ![badge-no-other-paradigms][]      |    | ☑️ ✅ |    |    |    |    |

### No Statements

| Name                                                                 | Description                                    | 💼                               | ⚠️ | 🚫 | 🔧 | 💡 | 💭 | ❌  |
| :------------------------------------------------------------------- | :--------------------------------------------- | :------------------------------- | :- | :- | :- | :- | :- | :- |
| [no-conditional-statements](docs/rules/no-conditional-statements.md) | Disallow conditional statements.               | ✅ 🔒 ![badge-no-statements][]    |    | ☑️ |    |    | 💭 |    |
| [no-expression-statements](docs/rules/no-expression-statements.md)   | Disallow expression statements.                | ✅ 🔒 ![badge-no-statements][]    |    | ☑️ |    |    | 💭 |    |
| [no-loop-statements](docs/rules/no-loop-statements.md)               | Disallow imperative loops.                     | ☑️ ✅ 🔒 ![badge-no-statements][] |    |    |    |    |    |    |
| [no-return-void](docs/rules/no-return-void.md)                       | Disallow functions that don't return anything. | ☑️ ✅ 🔒 ![badge-no-statements][] |    |    |    |    | 💭 |    |

### Stylistic

| Name                                                                   | Description                                                            | 💼 | ⚠️ | 🚫 | 🔧 | 💡 | 💭 | ❌  |
| :--------------------------------------------------------------------- | :--------------------------------------------------------------------- | :- | :- | :- | :- | :- | :- | :- |
| [prefer-property-signatures](docs/rules/prefer-property-signatures.md) | Prefer property signatures over method signatures.                     | 🎨 |    |    |    |    | 💭 |    |
| [prefer-tacit](docs/rules/prefer-tacit.md)                             | Replaces `x => f(x)` with just `f`.                                    |    | 🎨 |    |    | 💡 | 💭 |    |
| [readonly-type](docs/rules/readonly-type.md)                           | Require consistently using either `readonly` keywords or `Readonly<T>` | 🎨 |    |    | 🔧 |    | 💭 |    |

<!-- end auto-generated rules list -->
<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

[badge-currying]: https://img.shields.io/badge/-currying-red.svg
[badge-no-exceptions]: https://img.shields.io/badge/-no--exceptions-blue.svg
[badge-no-mutations]: https://img.shields.io/badge/-no--mutations-orange.svg
[badge-no-other-paradigms]: https://img.shields.io/badge/-no--other--paradigms-yellow.svg
[badge-no-statements]: https://img.shields.io/badge/-no--statements-purple.svg

## External Recommended Rules

In addition to the above rules, there are a few other rules we recommended.

These rules are what are included in the _external recommended_ rulesets.

### Vanilla Rules

- [no-var](https://eslint.org/docs/rules/no-var)\
  Without this rule, it is still possible to create mutable `var` variables.

- [no-param-reassign](https://eslint.org/docs/rules/no-param-reassign)\
  Don't allow function parameters to be reassigned, they should be treated as constants.

- [prefer-const](https://eslint.org/docs/rules/prefer-const)\
  This rule provides a helpful fixer when converting from an imperative code style to a functional one.

### Typescript Rules

- [@typescript-eslint/prefer-readonly](https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/docs/rules/prefer-readonly.md)\
  This rule is helpful when working with classes.

- [@typescript-eslint/switch-exhaustiveness-check](https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/docs/rules/switch-exhaustiveness-check.md)\
  Although our [no-conditional-statements](./docs/rules/no-conditional-statements.md) rule also performs this check,
  this rule has a fixer that will implement the unimplemented cases which can be useful.

## Contributing

[See our contributing guide](./CONTRIBUTING.md).

## Prior work

This project started as a port of [tslint-immutable](https://github.com/jonaskello/tslint-immutable)
which was originally inspired by [eslint-plugin-immutable](https://github.com/jhusain/eslint-plugin-immutable).
