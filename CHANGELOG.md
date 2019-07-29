# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased](https://github.com/jonaskello/eslint-plugin-functional/compare/v0.5.0...HEAD)

## [v0.5.0](https://github.com/jonaskello/eslint-plugin-functional/compare/v0.4.0...v0.5.0)

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

## [v0.4.0](https://github.com/jonaskello/eslint-plugin-functional/compare/v0.3.0...v0.4.0)

### Changed

- Renamed to pacakge from `eslint-plugin-ts-immutable` to `eslint-plugin-functional`.

## [v0.3.0](https://github.com/jonaskello/eslint-plugin-functional/compare/v0.2.1...v0.3.0)

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
