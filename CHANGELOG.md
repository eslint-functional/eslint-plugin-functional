# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]

## [v6.0.0] - 2019-06-05

* Overhaul ignore-prefix, adding in ignore-suffix and ignore-pattern. See PR [#137](https://github.com/jonaskello/tslint-immutable/pull/137)
* Updated the list of rules included in each ruleset. See PR [#138](https://github.com/jonaskello/tslint-immutable/pull/138)

## [v5.5.2] - 2019-03-25

* readonly-array rule with the option ignore-prefix set will now ignore nested arrays within an ignored variable. See [#132](https://github.com/jonaskello/tslint-immutable/issues/132). See PR [#133](https://github.com/jonaskello/tslint-immutable/pull/133)

## [v5.5.1] - 2019-03-22

* no-array-mutation now checks nested arrays. See [#134](https://github.com/jonaskello/tslint-immutable/issues/134). See PR [#135](https://github.com/jonaskello/tslint-immutable/pull/135)

## [v5.5.0] - 2019-03-21

* readonly-array rule now allows for the readonly keyword to specify an array as readonly. This is a new feature supported in TypeScript 3.4. See [#129](https://github.com/jonaskello/tslint-immutable/issues/129). See PR [#130](https://github.com/jonaskello/tslint-immutable/pull/130)

## [v5.4.0] - 2019-03-14

* no-object-mutation rule now disallows Object.assign mutation on identifiers and property access expressions. See [#112](https://github.com/jonaskello/tslint-immutable/issues/112). See PR [#127](https://github.com/jonaskello/tslint-immutable/pull/127)

## [v5.3.3] - 2019-03-12

* Fixed rule readonly-array with option ignore-return-type not checking within union, intersection and conditional types. This fix should now catch all return types that contain a nested array. See [#124](https://github.com/jonaskello/tslint-immutable/issues/124). See PR [#125](https://github.com/jonaskello/tslint-immutable/pull/125)

## [v5.3.2] - 2019-03-07

### Fixed

* Fixed rule readonly-array with option ignore-return-type not checking within tuple types. See [#121](https://github.com/jonaskello/tslint-immutable/issues/121). See PR [#122](https://github.com/jonaskello/tslint-immutable/pull/122)

## [v5.3.1] - 2019-03-07

### Fixed

* Fixed rule readonly-array with option ignore-return-type not checking within generic parameters. See [#117](https://github.com/jonaskello/tslint-immutable/issues/117). Thanks to [@RebeccaStevens](https://github.com/RebeccaStevens) for this fix! (See PR [#120](https://github.com/jonaskello/tslint-immutable/pull/120)).

## [v5.3.0] - 2019-02-19

### Added

* New rule `no-reject` (moved from no-throw rule in previous version). See PR [#118](https://github.com/jonaskello/tslint-immutable/pull/118).

## [v5.2.0] - 2019-02-14

### Added

* Update `no-throw` to not allow Promise.reject(). See [#115](https://github.com/jonaskello/tslint-immutable/issues/115) and PR [#116](https://github.com/jonaskello/tslint-immutable/pull/116). Thanks to [@sbdchd](https://github.com/sbdchd) for this addition!

## [v5.1.2] - 2019-01-25

* Republished without changes (becuase previous publish failed).

## [v5.1.1] - 2019-01-25

### Fixed

* Fixes readonly-keyword fixer adds the `readonly` modifier in the wrong place for decorated class properties. See [#81](https://github.com/jonaskello/tslint-immutable/issues/81). Thanks to [@tkryskiewicz](https://github.com/tkryskiewicz) for this fix! (See PR [#113](https://github.com/jonaskello/tslint-immutable/pull/113)).

## [v5.1.0] - 2019-01-15

### Added

* New option `ignore-new-array` for the `no-array-mutation` rule. This option replaces the `ignore-mutation-following-accessor` option, however the old option name will remain as an alias and will be removed in the next major release. See [#102](https://github.com/jonaskello/tslint-immutable/issues/102). Thanks to [@RebeccaStevens](https://github.com/RebeccaStevens) for adding this option! (See PR [#110](https://github.com/jonaskello/tslint-immutable/pull/110))

## [v5.0.1] - 2018-12-15

### Fixed

* Fixed a regression in the `readonly-array`. See [#104](https://github.com/jonaskello/tslint-immutable/issues/104).

## [v5.0.0] - 2018-11-24

### Changed

* Internal refactoring to use the [tsutils](https://www.npmjs.com/package/tsutils) library, see PR [100](https://github.com/jonaskello/tslint-immutable/pull/100). This cleans up a lot of code and makes it easier to do further development. Becasue the tsutils library requires typescript version >=2.8 and node >=6 this refactoring required a major version bump. Big thanks to [RebeccaStevens](https://github.com/RebeccaStevens) for the amazing work on this refactoring :-).

## [v4.9.1] - 2018-11-04

### Fixed

* `ignore-return-type` option for the `readonly-array` doesn't catch method declarations. See [#95](https://github.com/jonaskello/tslint-immutable/issues/95).

## [v4.9.0] - 2018-11-01

### Added

* New option `ignore-return-type` for the `readonly-array` rule. See [#82](https://github.com/jonaskello/tslint-immutable/issues/82). Thanks to [@RebeccaStevens](https://github.com/RebeccaStevens) for adding this option! (See PR [#95](https://github.com/jonaskello/tslint-immutable/pull/95))

## [v4.8.0] - 2018-10-07

### Added

* New option `ignore-rest-parameters` for the `readonly-array` rule. See [#73](https://github.com/jonaskello/tslint-immutable/issues/73). Thanks to [@aboyton](https://github.com/aboyton) for adding this option! (See PR [#93](https://github.com/jonaskello/tslint-immutable/pull/93))

### Added

## [v4.7.0] - 2018-08-23

### Added

* New option `ignore-mutation-following-accessor` for the `no-array-mutation` rule. See [#88](https://github.com/jonaskello/tslint-immutable/issues/88). Thanks to [@RebeccaStevens](https://github.com/RebeccaStevens) for adding this option! (See PR [#89](https://github.com/jonaskello/tslint-immutable/pull/89))

* New rules `no-throw` and `no-try`. See [#86](https://github.com/jonaskello/tslint-immutable/issues/86). Thanks to [@RebeccaStevens](https://github.com/RebeccaStevens) for adding these rules! (See PR [#91](https://github.com/jonaskello/tslint-immutable/pull/91))

* Option for enabling all the rules with `tslint-immutable/all`. See [#66](https://github.com/jonaskello/tslint-immutable/issues/66). Thanks to [@bakerface](https://github.com/bakerface) for adding this! (See PR [#85](https://github.com/jonaskello/tslint-immutable/pull/85))

## [v4.6.0] - 2018-06-12

### Added

* New rule `no-array-mutation`. See [#74](https://github.com/jonaskello/tslint-immutable/issues/74). Thanks to [@RebeccaStevens](https://github.com/RebeccaStevens) for adding this rule! (See PR [#84](https://github.com/jonaskello/tslint-immutable/pull/84))

## [v4.5.4] - 2018-04-17

* `no-object-mutation` rule, allow class member mutation in constructor [#79](https://github.com/jonaskello/tslint-immutable/pull/79).

* `readonly-keyword` rule, check function params and return type [#80](https://github.com/jonaskello/tslint-immutable/pull/80)

## [v4.5.3] - 2018-03-31

### Fixed

* `readonly-array` fixer does not work for arrays with nested template type. See [#24](https://github.com/jonaskello/tslint-immutable/issues/24). Thanks to [@geon](https://github.com/geon) for fixing this longstanding bug! (See PR [#78](https://github.com/jonaskello/tslint-immutable/pull/78))

## [v4.5.2] - 2018-02-27

### Fixed

* Ignore await when checking `ignore-prefix` in `no-expression-statement`. See [#76](https://github.com/jonaskello/tslint-immutable/issues/76).

* `no-class` does not catch class expressions. See [#65](https://github.com/jonaskello/tslint-immutable/issues/65). Thanks to [@ianbollinger](https://github.com/ianbollinger) for this fix! (See PR [#70](https://github.com/jonaskello/tslint-immutable/pull/70))

## [v4.5.1] - 2018-01-16

### Fixed

* `no-mixed-interface` does not understand arrow function notation. See [#62](https://github.com/jonaskello/tslint-immutable/issues/62). Thanks to [@geon](https://github.com/geon) for this fix! (See PR [#63](https://github.com/jonaskello/tslint-immutable/pull/63))

## [v4.5.0] - 2017-12-29

### Added

* New options `ignore-interface`, and `ignore-class` for the `readonly-keyword` rule. See [#44](https://github.com/jonaskello/tslint-immutable/issues/44) for background. Thanks to [@aboyton](https://github.com/aboyton) for these options! (See PR [#57](https://github.com/jonaskello/tslint-immutable/pull/57))

* The `ignore-prefix` option can be an array for all rules (previously just for `no-expression-statement` and `no-object-mutation`).

* New rule `no-delete`. See [readme](https://github.com/jonaskello/tslint-immutable#no-delete) for more info.

* New rule `no-if-statement`. See [readme](https://github.com/jonaskello/tslint-immutable#no-if-statement) for more info and [#54](https://github.com/jonaskello/tslint-immutable/issues/54) for discussion.

* New rule `no-loop-statement`. See [readme](https://github.com/jonaskello/tslint-immutable#no-loop-statement) for more info and [#54](https://github.com/jonaskello/tslint-immutable/issues/54) for discussion.

### Fixed

* `no-mixed-interface` does not understand arrow function notation. See [#60](https://github.com/jonaskello/tslint-immutable/issues/60).

## [v4.4.0] - 2017-09-27

### Added

* New option `ignore-prefix` for the `no-object-mutation` rule. See [#43](https://github.com/jonaskello/tslint-immutable/issues/43) for background. Thanks to [@miangraham](https://github.com/miangraham) for this option! (See PR [#53](https://github.com/jonaskello/tslint-immutable/pull/53))

## [v4.3.0] - 2017-09-23

### Fixed

* The readonly-keyword rule now properly checks for `readonly` modifier of `class` property declarations. See [#49](https://github.com/jonaskello/tslint-immutable/issues/49) and PR [#50](https://github.com/jonaskello/tslint-immutable/pull/50).

### Added

* New rule [no-method-signature](https://github.com/jonaskello/tslint-immutable#no-method-signature). See [#30](https://github.com/jonaskello/tslint-immutable/issues/30) and PR in [#51](https://github.com/jonaskello/tslint-immutable/pull/51).
* New options `ignore-local`, and `ignore-prefix` for the `no-let` rule. See [#32](https://github.com/jonaskello/tslint-immutable/issues/32), also requested in [#43](https://github.com/jonaskello/tslint-immutable/issues/43). See PR [#48](https://github.com/jonaskello/tslint-immutable/pull/48).
* Added tslint core rule [no-parameter-reassignment](https://palantir.github.io/tslint/rules/no-parameter-reassignment/) as [recommended](https://github.com/jonaskello/tslint-immutable#no-parameter-reassignment) in the README.

## [v4.2.1] - 2017-09-21

### Fixed

* The readonly-array rule with ignore-local option does not work within `class`. See [45](https://github.com/jonaskello/tslint-immutable/issues/45).

## [v4.2.0] - 2017-09-14

### Added

* New option `ignore-prefix` for the `no-expression-statement` rule. See [#39](https://github.com/jonaskello/tslint-immutable/issues/39) for background. Thanks to [@algesten](https://github.com/algesten) for this option! (See PR [#42](https://github.com/jonaskello/tslint-immutable/pull/42))

## [v4.1.0] - 2017-08-21

### Added

* New rule `no-object-mutation`. See [#36](https://github.com/jonaskello/tslint-immutable/issues/36) for background. Thanks to [@miangraham](https://github.com/miangraham) for this rule! (See PR [#37](https://github.com/jonaskello/tslint-immutable/pull/37))

## [v4.0.2] - 2017-07-16

### Added

* Added an index.js file to the rules directory in order for rulesDirectory to work. See [#35](https://github.com/jonaskello/tslint-immutable/issues/35).

## [v4.0.1] - 2017-06-06

### Fixed

* Invalid default tslint config (it included the removed rules).

## [v4.0.0] - 2017-06-06

### Removed

* `readonly-interface` rule. This rule is replaced by the `readonly-keyword` rule.
* `readonly-indexer` rule. This rule is replaced by the `readonly-keyword` rule.
* `no-new` rule. Please see background in [#2](https://github.com/jonaskello/tslint-immutable/issues/2).
* `no-arguments` rule. This rule has been moved to the [tslint-divid](https://www.npmjs.com/package/tslint-divid) package.
* `no-label` rule. This rule has been moved to the [tslint-divid](https://www.npmjs.com/package/tslint-divid) package.
* `no-semicolon-interface` rule. This rule has been moved to the [tslint-divid](https://www.npmjs.com/package/tslint-divid) package.
* `import-containment` rule. This rule has been moved to the [tslint-divid](https://www.npmjs.com/package/tslint-divid) package.

## [v3.4.2] - 2017-05-14

### Added

* Notice in readme about deprecrating the `no-new` rule.

### Deprecated

* The `no-new` rule. See [#2](https://github.com/jonaskello/tslint-immutable/issues/2) for background.

## [v3.4.1] - 2017-05-14

### Added

* Note in readme about moving the "other" rules. The `no-argument`, `no-label`, `no-semicolon-interface`, and `import containtment` rules are moving to [tslint-divid](https://github.com/jonaskello/tslint-divid). See [#19](https://github.com/jonaskello/tslint-immutable/issues/19) for more information.

### Deprecated

* The `no-argument`, `no-label`, `no-semicolon-interface`, and `import containtment` rules as noted above.

## [v3.4.0] - 2017-05-14

### Added

* New rule `readonly-keyword`, to replace `readonly-interface` and `readonly-indexer` [#31](https://github.com/jonaskello/tslint-immutable/issues/31)

### Deprecated

* The `readonly-interface`, and `readonly-indexer` rules are deprecated and will be removed in the next major release. Please use the `readonly-keyword` rule instead.

## [v3.3.2] - 2017-05-13

### Fixed

* Functions in interfaces cannot have readonly specified but are still checked [#28](https://github.com/jonaskello/tslint-immutable/issues/28)

## [v3.3.1] - 2017-05-09

### Fixed

* patch: fix main file in package.json. Thanks to [@yonbeastie](https://github.com/yonbeastie). (see [#29](https://github.com/jonaskello/tslint-immutable/pull/29))

## [v3.3.0] - 2017-05-09

### Fixed

* ignore-local does not work for function assigned to const [#23](https://github.com/jonaskello/tslint-immutable/issues/23)

### Added

* Add default tslint json. Thanks to [@yonbeastie](https://github.com/yonbeastie). (see [#26](https://github.com/jonaskello/tslint-immutable/pull/26))

## [v3.2.0] - 2017-04-10

### Fixed

* readonly-array does not check shorthand syntax in return types with ignore-local option [#21](https://github.com/jonaskello/tslint-immutable/issues/21)

### Added

* Fixer for the `readonly-array` rule.

## [v3.1.2] - 2017-04-09

### Fixed

* readonly-array does not check return type when ignore-local is enabled [#16](https://github.com/jonaskello/tslint-immutable/issues/16)
* readonly-array does not check shorthand syntax [#20](https://github.com/jonaskello/tslint-immutable/issues/20).

## Changed

* Impicit return type is not checked in readonly-array [#18](https://github.com/jonaskello/tslint-immutable/issues/18).

## [v3.1.1] - 2017-04-05

### Fixed

* Function parameters are not checked when using ignore-local option, [#13](https://github.com/jonaskello/tslint-immutable/issues/13).
* Implicit Array type by default value for function parameter is not checked, [#14](https://github.com/jonaskello/tslint-immutable/issues/14).

## [v3.1.0] - 2017-04-05

### Added

* [`ignore-local`](https://github.com/jonaskello/tslint-immutable#using-the-ignore-local-option) option added to `readonly-array`.
* [`ignore-prefix`](https://github.com/jonaskello/tslint-immutable#using-the-ignore-local-option) option added to `readonly-array`.

## [v3.0.0] - 2017-04-02

### Changed

* Upgraded to tslint 5.0.0

### Added

* `readonly-array` now also checks for implicity declared mutable arrays.

## [v2.1.1] - 2017-03-29

### Fixed

* Remove vestigial `noMutationRule.js` and `no-mutation` example from README, thanks to [@pmlamotte](https://github.com/pmlamotte). (see [#6](https://github.com/jonaskello/tslint-immutable/pull/6))

## [v2.1.0] - 2016-12-12

### Added

* `readonly-indexer` rule.

### Fixed

* Fixed a bug in `readonly-interface` rule that made it fail on indexer declarations.

## [v2.0.0] - 2016-12-12

### Added

* `readonly-interface` rule.
* `readonly-indexer` rule.
* `readonly-array` rule.
* `no-class` rule.
* `no-new` rule.
* `no-mixed-interface` rule.
* `import-containment` rule.
* `no-arguments` rule.
* `no-label` rule.
* `no-semicolon-interface` rule.

### Removed

* `no-mutation` rule (replaced by the `readonly-interface` rule).

## v1.0.0 - 2016-12-10

### Added

* `no-expression-statement` rule.
* `no-let` rule.
* `no-mutation` rule.
* `no-this` rule.

[unreleased]: https://github.com/jonaskello/tslint-immutable/compare/v5.3.0...master
[v5.3.0]: https://github.com/jonaskello/tslint-immutable/compare/v5.2.0...v5.3.0
[v5.2.0]: https://github.com/jonaskello/tslint-immutable/compare/v5.1.2...v5.2.0
[v5.1.2]: https://github.com/jonaskello/tslint-immutable/compare/v5.1.1...v5.1.2
[v5.1.1]: https://github.com/jonaskello/tslint-immutable/compare/v5.0.1...v5.1.1
[v5.1.0]: https://github.com/jonaskello/tslint-immutable/compare/v5.0.1...v5.1.0
[v5.0.1]: https://github.com/jonaskello/tslint-immutable/compare/v5.0.0...v5.0.1
[v5.0.0]: https://github.com/jonaskello/tslint-immutable/compare/v4.9.1...v5.0.0
[v4.9.1]: https://github.com/jonaskello/tslint-immutable/compare/v4.9.0...v4.9.1
[v4.9.0]: https://github.com/jonaskello/tslint-immutable/compare/v4.8.0...v4.9.0
[v4.8.0]: https://github.com/jonaskello/tslint-immutable/compare/v4.7.0...v4.8.0
[v4.7.0]: https://github.com/jonaskello/tslint-immutable/compare/v4.6.0...v4.7.0
[v4.6.0]: https://github.com/jonaskello/tslint-immutable/compare/v4.5.4...v4.6.0
[v4.5.4]: https://github.com/jonaskello/tslint-immutable/compare/v4.5.3...v4.5.4
[v4.5.3]: https://github.com/jonaskello/tslint-immutable/compare/v4.5.2...v4.5.3
[v4.5.2]: https://github.com/jonaskello/tslint-immutable/compare/v4.5.1...v4.5.2
[v4.5.1]: https://github.com/jonaskello/tslint-immutable/compare/v4.5.0...v4.5.1
[v4.5.0]: https://github.com/jonaskello/tslint-immutable/compare/v4.4.0...v4.5.0
[v4.4.0]: https://github.com/jonaskello/tslint-immutable/compare/v4.3.0...v4.4.0
[v4.3.0]: https://github.com/jonaskello/tslint-immutable/compare/v4.2.1...v4.3.0
[v4.2.1]: https://github.com/jonaskello/tslint-immutable/compare/v4.2.0...v4.2.1
[v4.2.0]: https://github.com/jonaskello/tslint-immutable/compare/v4.1.0...v4.2.0
[v4.1.0]: https://github.com/jonaskello/tslint-immutable/compare/v4.0.2...v4.1.0
[v4.0.2]: https://github.com/jonaskello/tslint-immutable/compare/v4.0.1...v4.0.2
[v4.0.1]: https://github.com/jonaskello/tslint-immutable/compare/v4.0.0...v4.0.1
[v4.0.0]: https://github.com/jonaskello/tslint-immutable/compare/v3.4.2...v4.0.0
[v3.4.2]: https://github.com/jonaskello/tslint-immutable/compare/v3.4.1...v3.4.2
[v3.4.1]: https://github.com/jonaskello/tslint-immutable/compare/v3.4.0...v3.4.1
[v3.4.0]: https://github.com/jonaskello/tslint-immutable/compare/v3.3.2...v3.4.0
[v3.3.2]: https://github.com/jonaskello/tslint-immutable/compare/v3.3.1...v3.3.2
[v3.3.1]: https://github.com/jonaskello/tslint-immutable/compare/v3.3.0...v3.3.1
[v3.3.0]: https://github.com/jonaskello/tslint-immutable/compare/v3.2.0...v3.3.0
[v3.2.0]: https://github.com/jonaskello/tslint-immutable/compare/v3.1.2...v3.2.0
[v3.1.2]: https://github.com/jonaskello/tslint-immutable/compare/v3.1.1...v3.1.2
[v3.1.1]: https://github.com/jonaskello/tslint-immutable/compare/v3.1.0...v3.1.1
[v3.1.0]: https://github.com/jonaskello/tslint-immutable/compare/v3.0.0...v3.1.0
[v3.0.0]: https://github.com/jonaskello/tslint-immutable/compare/v2.1.1...v3.0.0
[v2.1.2]: https://github.com/jonaskello/tslint-immutable/compare/v2.1.1...v2.1.2
[v2.1.1]: https://github.com/jonaskello/tslint-immutable/compare/v2.1.0...v2.1.1
[v2.1.0]: https://github.com/jonaskello/tslint-immutable/compare/v2.0.0...v2.1.0
[v2.0.0]: https://github.com/jonaskello/tslint-immutable/compare/v1.0.0...v2.0.0
