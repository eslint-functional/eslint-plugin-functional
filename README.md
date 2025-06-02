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

Tidelift is working with the maintainers of `eslint-plugin-functional` and a growing network of open source maintainers
to ensure your open source software supply chain meets enterprise standards now and into the future.
[Learn more.](https://tidelift.com/subscription/pkg/npm-eslint-plugin-functional?utm_source=npm-eslint-plugin-functional&utm_medium=referral&utm_campaign=enterprise&utm_term=repo)

## Getting Started

[See our getting started guide](./GETTING_STARTED.md).

## Rulesets

The following rulesets are made available by this plugin.

Presets:

- **Strict** (`configs.strict`)\
  Enforce recommended rules designed to strictly enforce functional programming.

- **Recommended** (`configs.recommended`)\
  Has the same goal as the `strict` preset but a little more lenient, allowing for functional-like coding styles and
  nicer integration with non-functional 3rd-party libraries.

- **Lite** (`configs.lite`)\
  Good if you're new to functional programming or are converting a large codebase.

Categorized:

- **Currying** (`configs.currying`)\
  JavaScript functions support syntax that is not compatible with curried functions. To enforce currying, this syntax
  should be prevented.

- **No Exceptions** (`configs.noExceptions`)\
  Functional programming style does not use run-time exceptions. Instead expressions produces values to indicate errors.

- **No Mutations** (`configs.noMutations`)\
  Prevent mutating any data as that's not functional

- **No Other Paradigms** (`configs.noOtherParadigms`)\
  JavaScript is multi-paradigm, allowing not only functional, but object-oriented as well as other programming styles.
  To promote a functional style, prevent the use of other paradigm styles.

- **No Statements** (`configs.noStatements`)\
  In functional programming everything is an expression that produces a value.
  JavaScript has a lot of syntax that is just statements that does not produce a value.
  That syntax has to be prevented to promote a functional style.

- **Stylistic** (`configs.stylistic`)\
  Enforce code styles that can be considered to be more functional.

Other:

- **All** (`configs.all`)\
  Enables all rules defined in this plugin.

- **Off** (`configs.off`)\
  Disable all rules defined in this plugin.

- **Disable Type Checked** (`configs.disableTypeChecked`)\
  Disable all rules that require type information.

- **External Vanilla Recommended** (`configs.externalVanillaRecommended`)\
  Configures recommended [vanilla ESLint](https://www.npmjs.com/package/eslint) rules.

- **External TypeScript Recommended** (`configs.externalTypeScriptRecommended`)\
  Configures recommended [TypeScript ESLint](https://www.npmjs.com/package/@typescript-eslint/eslint-plugin) rules.
  Enabling this ruleset will also enable the vanilla one.

The [below section](#rules) gives details on which rules are enabled by each ruleset.

## Rules

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

| Name                                                         | Description                    | 💼                           | ⚠️  | 🚫                            | 🔧  | 💡  | 💭  | ❌  |
| :----------------------------------------------------------- | :----------------------------- | :--------------------------- | :-- | :---------------------------- | :-- | :-- | :-- | :-- |
| [functional-parameters](docs/rules/functional-parameters.md) | Enforce functional parameters. | ☑️ ✅ 🔒 ![badge-currying][] |     | ![badge-disableTypeChecked][] |     |     | 💭  |     |

### No Exceptions

| Name                                                     | Description                                            | 💼                               | ⚠️  | 🚫                            | 🔧  | 💡  | 💭  | ❌  |
| :------------------------------------------------------- | :----------------------------------------------------- | :------------------------------- | :-- | :---------------------------- | :-- | :-- | :-- | :-- |
| [no-promise-reject](docs/rules/no-promise-reject.md)     | Disallow rejecting promises.                           |                                  |     |                               |     |     |     |     |
| [no-throw-statements](docs/rules/no-throw-statements.md) | Disallow throwing exceptions.                          | ☑️ ✅ 🔒 ![badge-noExceptions][] |     | ![badge-disableTypeChecked][] |     |     | 💭  |     |
| [no-try-statements](docs/rules/no-try-statements.md)     | Disallow try-catch[-finally] and try-finally patterns. | 🔒 ![badge-noExceptions][]       |     | ☑️ ✅                         |     |     |     |     |

### No Mutations

| Name                                                                         | Description                                                     | 💼                              | ⚠️  | 🚫                            | 🔧  | 💡  | 💭  | ❌  |
| :--------------------------------------------------------------------------- | :-------------------------------------------------------------- | :------------------------------ | :-- | :---------------------------- | :-- | :-- | :-- | :-- |
| [immutable-data](docs/rules/immutable-data.md)                               | Enforce treating data as immutable.                             | ☑️ ✅ 🔒 ![badge-noMutations][] |     | ![badge-disableTypeChecked][] |     |     | 💭  |     |
| [no-let](docs/rules/no-let.md)                                               | Disallow mutable variables.                                     | ☑️ ✅ 🔒 ![badge-noMutations][] |     |                               |     |     |     |     |
| [prefer-immutable-types](docs/rules/prefer-immutable-types.md)               | Require function parameters to be typed as certain immutability | ☑️ ✅ 🔒 ![badge-noMutations][] |     | ![badge-disableTypeChecked][] | 🔧  | 💡  | 💭  |     |
| [prefer-readonly-type](docs/rules/prefer-readonly-type.md)                   | Prefer readonly types over mutable types.                       |                                 |     | ![badge-disableTypeChecked][] | 🔧  |     | 💭  | ❌  |
| [type-declaration-immutability](docs/rules/type-declaration-immutability.md) | Enforce the immutability of types based on patterns.            | ☑️ ✅ 🔒 ![badge-noMutations][] |     | ![badge-disableTypeChecked][] | 🔧  | 💡  | 💭  |     |

### No Other Paradigms

| Name                                                       | Description                                                               | 💼                                   | ⚠️  | 🚫                            | 🔧  | 💡  | 💭  | ❌  |
| :--------------------------------------------------------- | :------------------------------------------------------------------------ | :----------------------------------- | :-- | :---------------------------- | :-- | :-- | :-- | :-- |
| [no-class-inheritance](docs/rules/no-class-inheritance.md) | Disallow inheritance in classes.                                          | ☑️ ✅ 🔒 ![badge-noOtherParadigms][] |     |                               |     |     |     |     |
| [no-classes](docs/rules/no-classes.md)                     | Disallow classes.                                                         | ✅ 🔒 ![badge-noOtherParadigms][]    |     | ☑️                            |     |     |     |     |
| [no-mixed-types](docs/rules/no-mixed-types.md)             | Restrict types so that only members of the same kind are allowed in them. | ☑️ ✅ 🔒 ![badge-noOtherParadigms][] |     | ![badge-disableTypeChecked][] |     |     | 💭  |     |
| [no-this-expressions](docs/rules/no-this-expressions.md)   | Disallow this access.                                                     | 🔒 ![badge-noOtherParadigms][]       |     | ☑️ ✅                         |     |     |     |     |

### No Statements

| Name                                                                 | Description                                    | 💼                               | ⚠️  | 🚫                               | 🔧  | 💡  | 💭  | ❌  |
| :------------------------------------------------------------------- | :--------------------------------------------- | :------------------------------- | :-- | :------------------------------- | :-- | :-- | :-- | :-- |
| [no-conditional-statements](docs/rules/no-conditional-statements.md) | Disallow conditional statements.               | ✅ 🔒 ![badge-noStatements][]    |     | ☑️ ![badge-disableTypeChecked][] |     |     | 💭  |     |
| [no-expression-statements](docs/rules/no-expression-statements.md)   | Disallow expression statements.                | ✅ 🔒 ![badge-noStatements][]    |     | ☑️ ![badge-disableTypeChecked][] |     |     | 💭  |     |
| [no-loop-statements](docs/rules/no-loop-statements.md)               | Disallow imperative loops.                     | ☑️ ✅ 🔒 ![badge-noStatements][] |     |                                  |     |     |     |     |
| [no-return-void](docs/rules/no-return-void.md)                       | Disallow functions that don't return anything. | ☑️ ✅ 🔒 ![badge-noStatements][] |     | ![badge-disableTypeChecked][]    |     |     | 💭  |     |

### Stylistic

| Name                                                                   | Description                                                            | 💼  | ⚠️  | 🚫                            | 🔧  | 💡  | 💭  | ❌  |
| :--------------------------------------------------------------------- | :--------------------------------------------------------------------- | :-- | :-- | :---------------------------- | :-- | :-- | :-- | :-- |
| [prefer-property-signatures](docs/rules/prefer-property-signatures.md) | Prefer property signatures over method signatures.                     | 🎨  |     | ![badge-disableTypeChecked][] |     |     | 💭  |     |
| [prefer-tacit](docs/rules/prefer-tacit.md)                             | Replaces `x => f(x)` with just `f`.                                    |     | 🎨  | ![badge-disableTypeChecked][] |     | 💡  | 💭  |     |
| [readonly-type](docs/rules/readonly-type.md)                           | Require consistently using either `readonly` keywords or `Readonly<T>` | 🎨  |     | ![badge-disableTypeChecked][] | 🔧  |     | 💭  |     |

<!-- end auto-generated rules list -->
<!-- markdownlint-restore -->

[badge-currying]: https://img.shields.io/badge/-currying-red.svg
[badge-noExceptions]: https://img.shields.io/badge/-noExceptions-blue.svg
[badge-noMutations]: https://img.shields.io/badge/-noMutations-orange.svg
[badge-noOtherParadigms]: https://img.shields.io/badge/-noOtherParadigms-yellow.svg
[badge-noStatements]: https://img.shields.io/badge/-noStatements-purple.svg
[badge-disableTypeChecked]: https://img.shields.io/badge/-disableTypeChecked-navy.svg

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

### TypeScript Rules

- [@typescript-eslint/prefer-readonly](https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/docs/rules/prefer-readonly.mdx)\
  This rule is helpful when working with classes.

- [@typescript-eslint/switch-exhaustiveness-check](https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/docs/rules/switch-exhaustiveness-check.mdx)\
  Although our [no-conditional-statements](./docs/rules/no-conditional-statements.md) rule also performs this check,
  this rule has a fixer that will implement the unimplemented cases which can be useful.

## Contributing

[See our contributing guide](./CONTRIBUTING.md).

## Prior work

This project started as a port of [tslint-immutable](https://github.com/jonaskello/tslint-immutable)
which was originally inspired by [eslint-plugin-immutable](https://github.com/jhusain/eslint-plugin-immutable).
