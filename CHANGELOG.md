# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased](https://github.com/jonaskello/eslint-plugin-functional/compare/v1.0.2...HEAD)

### Merged

- Local mutation in a function now only refers to within the function's body [`#78`](https://github.com/jonaskello/eslint-plugin-functional/pull/78)
- no-mixed-interface rule does not exist anymore [`#81`](https://github.com/jonaskello/eslint-plugin-functional/pull/81)

### Fixed

- fix(prefer-readonly-type): local mutation in a function only refers to within the function's body [`#75`](https://github.com/jonaskello/eslint-plugin-functional/issues/75)

## [v1.0.2](https://github.com/jonaskello/eslint-plugin-functional/compare/v1.0.1...v1.0.2) - 2019-12-11

### Merged

- feat(no-expression-statement): allow specifying directive prologues [`#74`](https://github.com/jonaskello/eslint-plugin-functional/pull/74)

### Fixed

- fix(no-expression-statement): allow specifying directive prologues [`#68`](https://github.com/jonaskello/eslint-plugin-functional/issues/68)

## [v1.0.1](https://github.com/jonaskello/eslint-plugin-functional/compare/v1.0.0...v1.0.1) - 2019-12-11

### Merged

- fix(typeguards): only assume types if type information is not avaliable [`#73`](https://github.com/jonaskello/eslint-plugin-functional/pull/73)
- docs(readme): change tslint-immutable to eslint-plugin-functional #66 [`#69`](https://github.com/jonaskello/eslint-plugin-functional/pull/69)
- docs(readme): fix typos [`#70`](https://github.com/jonaskello/eslint-plugin-functional/pull/70)

### Fixed

- fix(typeguards): only assume types if type information is not avaliable [`#72`](https://github.com/jonaskello/eslint-plugin-functional/issues/72)

## [v1.0.0](https://github.com/jonaskello/eslint-plugin-functional/compare/v1.0.0-rc.2...v1.0.0) - 2019-10-14

### Merged

- Upgrade typescript-eslint packages [`#65`](https://github.com/jonaskello/eslint-plugin-functional/pull/65)
- Rename to no-mutations [`#62`](https://github.com/jonaskello/eslint-plugin-functional/pull/62)

### Changed

- Rename the "No mutability" heading and "immutable" ruleset to "no-mutations". [`#62`](https://github.com/jonaskello/eslint-plugin-functional/pull/62)

## [v1.0.0-rc.2](https://github.com/jonaskello/eslint-plugin-functional/compare/v1.0.0-rc.1...v1.0.0-rc.2) - 2019-08-07

### Fixed

- fix(prefer-readonly-type): index signatures in type literals can now be ignored [`#56`](https://github.com/jonaskello/eslint-plugin-functional/issues/56)

## [v1.0.0-rc.1](https://github.com/jonaskello/eslint-plugin-functional/compare/v0.5.3...v1.0.0-rc.1) - 2019-08-06

### Merged

- fix(immutable-data): Implement option ignoreImmediateMutation [`#59`](https://github.com/jonaskello/eslint-plugin-functional/pull/59)
- Rename Options [`#55`](https://github.com/jonaskello/eslint-plugin-functional/pull/55)
- Fix #56 [`#57`](https://github.com/jonaskello/eslint-plugin-functional/pull/57)

## [v0.5.3](https://github.com/jonaskello/eslint-plugin-functional/compare/v0.5.2...v0.5.3) - 2019-08-02

### Merged

- tslint migration guide [`#54`](https://github.com/jonaskello/eslint-plugin-functional/pull/54)
- Rename Rules [`#53`](https://github.com/jonaskello/eslint-plugin-functional/pull/53)

### Fixed

- fix(immutable-data): ignore call expressions on ignored arrays [`#56`](https://github.com/jonaskello/eslint-plugin-functional/issues/56)

## [v0.5.2](https://github.com/jonaskello/eslint-plugin-functional/compare/v0.5.1...v0.5.2) - 2019-07-30

### Merged

- Ignore Pattern Improvements [`#52`](https://github.com/jonaskello/eslint-plugin-functional/pull/52)

## [v0.5.1](https://github.com/jonaskello/eslint-plugin-functional/compare/v0.5.0...v0.5.1) - 2019-07-30

### Merged

- feat(no-try): Add options allowCatch and allowFinally. [`#50`](https://github.com/jonaskello/eslint-plugin-functional/pull/50)

### Fixed

- build: Remove @typescript-eslint as a dependency and thus remove typescript as a dependency. [`#49`](https://github.com/jonaskello/eslint-plugin-functional/issues/49)

## [v0.5.0](https://github.com/jonaskello/eslint-plugin-functional/compare/v0.4.0...v0.5.0) - 2019-07-29

### Merged

- Refactor out the checkNode function for createRule. [`#48`](https://github.com/jonaskello/eslint-plugin-functional/pull/48)
- Text matching of MemberExpression nodes now includes the property name [`#47`](https://github.com/jonaskello/eslint-plugin-functional/pull/47)
- Test configs [`#43`](https://github.com/jonaskello/eslint-plugin-functional/pull/43)
- feat(no-mixed-type): no-mixed-interface -> no-mixed-type [`#42`](https://github.com/jonaskello/eslint-plugin-functional/pull/42)
- feat(configs): Create additional configs for each category of rules. [`#40`](https://github.com/jonaskello/eslint-plugin-functional/pull/40)
- feat(functional-parameters): Add option to allow iifes [`#39`](https://github.com/jonaskello/eslint-plugin-functional/pull/39)
- new rule: prefer-type [`#38`](https://github.com/jonaskello/eslint-plugin-functional/pull/38)

### Fixed

- feat(functional-parameters): Add option to allow iifes [`#37`](https://github.com/jonaskello/eslint-plugin-functional/issues/37)

## [v0.4.0](https://github.com/jonaskello/eslint-plugin-functional/compare/v0.3.0...v0.4.0) - 2019-07-19

### Merged

- Rename the package [`#36`](https://github.com/jonaskello/eslint-plugin-functional/pull/36)

## [v0.3.0](https://github.com/jonaskello/eslint-plugin-functional/compare/v0.2.1...v0.3.0) - 2019-07-19

### Merged

- ReadonlySet and ReadonlyMap [`#30`](https://github.com/jonaskello/eslint-plugin-functional/pull/30)
- prefer-readonly-types [`#29`](https://github.com/jonaskello/eslint-plugin-functional/pull/29)
- no-return-void [`#28`](https://github.com/jonaskello/eslint-plugin-functional/pull/28)
- functional-parameters [`#27`](https://github.com/jonaskello/eslint-plugin-functional/pull/27)
- feat(readonly-keyword) Add support for parameter properties [`#26`](https://github.com/jonaskello/eslint-plugin-functional/pull/26)
- no-conditional-statement [`#23`](https://github.com/jonaskello/eslint-plugin-functional/pull/23)
- chore: Remove no-delete rule. [`#21`](https://github.com/jonaskello/eslint-plugin-functional/pull/21)
- new rule: immutable-data [`#22`](https://github.com/jonaskello/eslint-plugin-functional/pull/22)

### Fixed

- feat(immutable-data): Prevent object mutation methods. [`#16`](https://github.com/jonaskello/eslint-plugin-functional/issues/16)

## [v0.2.1](https://github.com/jonaskello/eslint-plugin-functional/compare/v0.2.0...v0.2.1) - 2019-07-12

### Merged

- Remove no-let fixer [`#14`](https://github.com/jonaskello/eslint-plugin-functional/pull/14)

### Fixed

- TypeScript is no longer imported unless it is available.

## [v0.2.0](https://github.com/jonaskello/eslint-plugin-functional/compare/v0.1.0...v0.2.0) - 2019-07-12

### Merged

- docs: Update supported rules. [`#8`](https://github.com/jonaskello/eslint-plugin-functional/pull/8)
- Make the code more functional [`#9`](https://github.com/jonaskello/eslint-plugin-functional/pull/9)
- Added ignoreAccessorPattern, ignorePattern now uses Regex matching [`#7`](https://github.com/jonaskello/eslint-plugin-functional/pull/7)
- Ignore option fix [`#6`](https://github.com/jonaskello/eslint-plugin-functional/pull/6)
- Consistent file casing [`#5`](https://github.com/jonaskello/eslint-plugin-functional/pull/5)
- Port docs for each rule [`#3`](https://github.com/jonaskello/eslint-plugin-functional/pull/3)

### Fixed

- feat(ignore-option): Add ignoreAccessorPattern option to deal with accessors and switch ignorePatter [`#4`](https://github.com/jonaskello/eslint-plugin-functional/issues/4)

## [v0.1.0](https://github.com/jonaskello/eslint-plugin-functional/releases/tag/v0.1.0) - 2019-07-01

This is the first release and everything is experimental at this point.
