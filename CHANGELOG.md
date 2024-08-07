# Changelog
All notable changes to this project will be documented in this file. Dates are displayed in UTC.

## [7.0.1](https://github.com/eslint-functional/eslint-plugin-functional/compare/v7.0.0...v7.0.1) (2024-08-07)


### Bug Fixes

* don't throw when typescript can't be resolved ([afb05bd](https://github.com/eslint-functional/eslint-plugin-functional/commit/afb05bdf934d8f63bde405f39c1c5233ad8be572))

# [7.0.0](https://github.com/eslint-functional/eslint-plugin-functional/compare/v6.6.3...v7.0.0) (2024-08-05)


### Bug Fixes

* checking of types from ts's lib are now more strict ([#862](https://github.com/eslint-functional/eslint-plugin-functional/issues/862)) ([39beb25](https://github.com/eslint-functional/eslint-plugin-functional/commit/39beb25a5c1805047abd76055e6d5aaeecc961e0))


### Features

* eslint 9 migration ([#809](https://github.com/eslint-functional/eslint-plugin-functional/issues/809)) ([de4e3ea](https://github.com/eslint-functional/eslint-plugin-functional/commit/de4e3ea3370663c29cba8d8f773445a17885a59e))
* **functional-parameters:** allow overriding options based on where the function type is declared ([#803](https://github.com/eslint-functional/eslint-plugin-functional/issues/803)) ([21396d5](https://github.com/eslint-functional/eslint-plugin-functional/commit/21396d598cb4b8ca403b8b04f15b295a7f2580e0)), closes [#575](https://github.com/eslint-functional/eslint-plugin-functional/issues/575)
* **functional-parameters:** change options in recommended and lite configs ([#811](https://github.com/eslint-functional/eslint-plugin-functional/issues/811)) ([b3cb8d9](https://github.com/eslint-functional/eslint-plugin-functional/commit/b3cb8d95de88cca7706f73175aa928ea83380788))
* **immutable-data:** allows for applying overrides to the options based on the root object's type ([#826](https://github.com/eslint-functional/eslint-plugin-functional/issues/826)) ([c04e425](https://github.com/eslint-functional/eslint-plugin-functional/commit/c04e4253953a2353706ed0feb963249dcb35fd4c))
* **no-classes:** add options ignoreIdentifierPattern and ignoreCodePattern ([#863](https://github.com/eslint-functional/eslint-plugin-functional/issues/863)) ([18aede1](https://github.com/eslint-functional/eslint-plugin-functional/commit/18aede1e4ea68385f06fb4b52468ee49eec1f620)), closes [#851](https://github.com/eslint-functional/eslint-plugin-functional/issues/851)
* **no-throw-statements:** replace option `allowInAsyncFunctions` with `allowToRejectPromises` ([#839](https://github.com/eslint-functional/eslint-plugin-functional/issues/839)) ([c2c589c](https://github.com/eslint-functional/eslint-plugin-functional/commit/c2c589cd8fd4af9bd55cd148c7826a15e90c6d81)), closes [#838](https://github.com/eslint-functional/eslint-plugin-functional/issues/838)
* **prefer-immutable-types:** allow overriding options based on where the type is declared ([#804](https://github.com/eslint-functional/eslint-plugin-functional/issues/804)) ([86fa76a](https://github.com/eslint-functional/eslint-plugin-functional/commit/86fa76a5dc66958b8fba96fcc0be5c665fd4ac40)), closes [#800](https://github.com/eslint-functional/eslint-plugin-functional/issues/800)
* **prefer-immutable-types:** change the options in recommeneded and lite configs ([#810](https://github.com/eslint-functional/eslint-plugin-functional/issues/810)) ([defd713](https://github.com/eslint-functional/eslint-plugin-functional/commit/defd7136dbbd687c6ad176fb9f1b5660363cac38))


### BREAKING CHANGES

* The minimum supported Node version is now 18.18.0 (#809)
* The minimum supported TypeScript version is now 4.7.4 (#809)
* The minimum supported Eslint version is now 9.0.0 (#809)
* **no-throw-statements:** replace option `allowInAsyncFunctions` with `allowToRejectPromises` (#839)

## [6.6.3](https://github.com/eslint-functional/eslint-plugin-functional/compare/v6.6.2...v6.6.3) (2024-07-11)


### Bug Fixes

* **immutable-data:** ignoreAccessorPattern can now handle NonNullExpressions and ChainExpressions ([#849](https://github.com/eslint-functional/eslint-plugin-functional/issues/849)) ([f6ff69b](https://github.com/eslint-functional/eslint-plugin-functional/commit/f6ff69b0a4bcb0b170b30cbc0605201f2b3ba271)), closes [#840](https://github.com/eslint-functional/eslint-plugin-functional/issues/840)

## [6.6.2](https://github.com/eslint-functional/eslint-plugin-functional/compare/v6.6.1...v6.6.2) (2024-07-11)


### Bug Fixes

* **no-conditional-statements:** allow continue and break statements with labels to be considered "returning" ([#846](https://github.com/eslint-functional/eslint-plugin-functional/issues/846)) ([969b77b](https://github.com/eslint-functional/eslint-plugin-functional/commit/969b77b53d488a7bd4381beac55256bb8b2cceda))
* **no-expression-statements:** arrow functions cannot be self returning ([#847](https://github.com/eslint-functional/eslint-plugin-functional/issues/847)) ([7217fa4](https://github.com/eslint-functional/eslint-plugin-functional/commit/7217fa4130c7375de46cc261d404acf783bcba03))
* **no-promise-reject:** new Promises and throw statements are now also checked ([#848](https://github.com/eslint-functional/eslint-plugin-functional/issues/848)) ([fbe27ad](https://github.com/eslint-functional/eslint-plugin-functional/commit/fbe27ad932dee5fd08a091cfa308f077aad25556))

## [6.6.1](https://github.com/eslint-functional/eslint-plugin-functional/compare/v6.6.0...v6.6.1) (2024-07-06)

# [6.6.0](https://github.com/eslint-functional/eslint-plugin-functional/compare/v6.5.2...v6.6.0) (2024-06-19)


### Features

* **prefer-immutable-types:** allow for changing suggestion messages ([#828](https://github.com/eslint-functional/eslint-plugin-functional/issues/828)) ([822cc33](https://github.com/eslint-functional/eslint-plugin-functional/commit/822cc33bde2e5a12e9d0d2a23ca2e628446d6904))

## [6.5.2](https://github.com/eslint-functional/eslint-plugin-functional/compare/v6.5.1...v6.5.2) (2024-06-19)

## [6.5.1](https://github.com/eslint-functional/eslint-plugin-functional/compare/v6.5.0...v6.5.1) (2024-04-15)


### Bug Fixes

* **prefer-tacit:** don't check member functions by default ([#808](https://github.com/eslint-functional/eslint-plugin-functional/issues/808)) ([4e6c3a9](https://github.com/eslint-functional/eslint-plugin-functional/commit/4e6c3a9d5c9124b1e9bc08b6315d0ad6246fc025)), closes [#805](https://github.com/eslint-functional/eslint-plugin-functional/issues/805)

# [6.5.0](https://github.com/eslint-functional/eslint-plugin-functional/compare/v6.4.1...v6.5.0) (2024-04-15)


### Features

* update is-immutable-type to v3.1.0 ([#806](https://github.com/eslint-functional/eslint-plugin-functional/issues/806)) ([40435b7](https://github.com/eslint-functional/eslint-plugin-functional/commit/40435b7316402b8492e267fff1ec3e133ac2c27a))

## [6.4.1](https://github.com/eslint-functional/eslint-plugin-functional/compare/v6.4.0...v6.4.1) (2024-04-14)


### Bug Fixes

* **prefer-tacit:** handling functions that don't map to directly to an eslint node ([#802](https://github.com/eslint-functional/eslint-plugin-functional/issues/802)) ([423e249](https://github.com/eslint-functional/eslint-plugin-functional/commit/423e249d9f419be3110105a242627cbd28db184a))

# [6.4.0](https://github.com/eslint-functional/eslint-plugin-functional/compare/v6.3.2...v6.4.0) (2024-04-01)


### Bug Fixes

* **type-declaration-immutability:** replace fixer with suggestions for recommended and lite configs ([ae62abb](https://github.com/eslint-functional/eslint-plugin-functional/commit/ae62abb0bef53ecebfcebb1563876b81ea728bab))


### Features

* **type-declaration-immutability:** add support for in-editor suggestions ([7a0a790](https://github.com/eslint-functional/eslint-plugin-functional/commit/7a0a79078382768eec6a467b6be81854469b8dbd)), closes [#797](https://github.com/eslint-functional/eslint-plugin-functional/issues/797)

## [6.3.2](https://github.com/eslint-functional/eslint-plugin-functional/compare/v6.3.1...v6.3.2) (2024-04-01)


### Bug Fixes

* **readonly-type:** empty object types should not trigger reports ([fc6a394](https://github.com/eslint-functional/eslint-plugin-functional/commit/fc6a394ab9d6ab800fc5ae0559fba5858b0936d8)), closes [#796](https://github.com/eslint-functional/eslint-plugin-functional/issues/796)

## [6.3.1](https://github.com/eslint-functional/eslint-plugin-functional/compare/v6.3.0...v6.3.1) (2024-04-01)


### Bug Fixes

* improve types for flat configs ([68e6450](https://github.com/eslint-functional/eslint-plugin-functional/commit/68e6450e39f75165d63d01487f7b61929f994dc1))

# [6.3.0](https://github.com/eslint-functional/eslint-plugin-functional/compare/v6.2.3...v6.3.0) (2024-03-25)


### Features

* **immutable-data:** add option for `ignoreNonConstDeclarations` to `treatParametersAsConst` ([#794](https://github.com/eslint-functional/eslint-plugin-functional/issues/794)) ([059591a](https://github.com/eslint-functional/eslint-plugin-functional/commit/059591af0507162092a36630b57619686b513f70)), closes [#724](https://github.com/eslint-functional/eslint-plugin-functional/issues/724)

## [6.2.3](https://github.com/eslint-functional/eslint-plugin-functional/compare/v6.2.2...v6.2.3) (2024-03-25)


### Bug Fixes

* **no-mixed-types:** handle more than just property signatures, check the type of type references ([#793](https://github.com/eslint-functional/eslint-plugin-functional/issues/793)) ([55bd794](https://github.com/eslint-functional/eslint-plugin-functional/commit/55bd79424bb4b2eb012b60a4b33fdef67d86390e)), closes [#734](https://github.com/eslint-functional/eslint-plugin-functional/issues/734)

## [6.2.2](https://github.com/eslint-functional/eslint-plugin-functional/compare/v6.2.1...v6.2.2) (2024-03-25)


### Bug Fixes

* **immutable-data:** ignore casting when evaluating the expressions ([#792](https://github.com/eslint-functional/eslint-plugin-functional/issues/792)) ([50e789a](https://github.com/eslint-functional/eslint-plugin-functional/commit/50e789a14bf7c776abbe91d4b22d13e50ddf4b01)), closes [#790](https://github.com/eslint-functional/eslint-plugin-functional/issues/790)

## [6.2.1](https://github.com/eslint-functional/eslint-plugin-functional/compare/v6.2.0...v6.2.1) (2024-03-24)


### Bug Fixes

* esm conditional imports ([a31b512](https://github.com/eslint-functional/eslint-plugin-functional/commit/a31b5127c655423b08eaf574b565e06456cba85b)), closes [#791](https://github.com/eslint-functional/eslint-plugin-functional/issues/791)
* improve typing exposed for flat configs ([6a65ac1](https://github.com/eslint-functional/eslint-plugin-functional/commit/6a65ac14537a205d084977a5551f459056f48611))
* type errors ([b73bcd2](https://github.com/eslint-functional/eslint-plugin-functional/commit/b73bcd211cc56d631097a2c7e29f7daad3657400))

# [6.2.0](https://github.com/eslint-functional/eslint-plugin-functional/compare/v6.1.1...v6.2.0) (2024-03-22)


### Bug Fixes

* **type-declaration-immutability:** some (hopefully all) maximum call stack size exceeded errors ([61c561c](https://github.com/eslint-functional/eslint-plugin-functional/commit/61c561c2cfd113046aa745894996054f53f171bd)), closes [#767](https://github.com/eslint-functional/eslint-plugin-functional/issues/767)


### Features

* add support for flat configs ([#789](https://github.com/eslint-functional/eslint-plugin-functional/issues/789)) ([5fa7c2c](https://github.com/eslint-functional/eslint-plugin-functional/commit/5fa7c2c2caebbdbc2fb295f72bb20c3a078cd913))

# [6.2.0-next.3](https://github.com/eslint-functional/eslint-plugin-functional/compare/v6.2.0-next.2...v6.2.0-next.3) (2024-03-14)


### Features

* move flat configs to new "flat" subpackage ([1d3533f](https://github.com/eslint-functional/eslint-plugin-functional/commit/1d3533fca47673ca1dc9e50dbe5a00ad8adb5362))

# [6.2.0-next.2](https://github.com/eslint-functional/eslint-plugin-functional/compare/v6.2.0-next.1...v6.2.0-next.2) (2024-03-14)


### Bug Fixes

* build types ([054a862](https://github.com/eslint-functional/eslint-plugin-functional/commit/054a86299e5b6c97a78f72a7711938273d56ef82))
* improve types ([2340489](https://github.com/eslint-functional/eslint-plugin-functional/commit/23404897399caa4f70ed0d5eb24b9ab300b65600))

# [6.2.0-next.1](https://github.com/eslint-functional/eslint-plugin-functional/compare/v6.1.1...v6.2.0-next.1) (2024-03-13)


### Features

* add support for flat configs ([901d52a](https://github.com/eslint-functional/eslint-plugin-functional/commit/901d52a889c4ecf5fa78474b1f7361edb6b9e60f))

## [6.1.1](https://github.com/eslint-functional/eslint-plugin-functional/compare/v6.1.0...v6.1.1) (2024-03-11)


### Bug Fixes

* **immutable-data:** handle immediate mutation of arrays generated from strings ([b003d1c](https://github.com/eslint-functional/eslint-plugin-functional/commit/b003d1c31834508870dfccb9e325e6f47f7e4a22)), closes [#759](https://github.com/eslint-functional/eslint-plugin-functional/issues/759)

# [6.1.0](https://github.com/eslint-functional/eslint-plugin-functional/compare/v6.0.1...v6.1.0) (2024-03-10)


### Bug Fixes

* **immutable-data:** treat Object.entries({}).sort() as immediate mutation ([245886f](https://github.com/eslint-functional/eslint-plugin-functional/commit/245886f7f4ff0b84e680f8b2db6b0a94ccbea383)), closes [#773](https://github.com/eslint-functional/eslint-plugin-functional/issues/773)


### Features

* new config to disable all rules that require type info ([af30f15](https://github.com/eslint-functional/eslint-plugin-functional/commit/af30f15f2ece3012b6b4f4826686cffcd6039a8c))

## [6.0.1](https://github.com/eslint-functional/eslint-plugin-functional/compare/v6.0.0...v6.0.1) (2024-02-23)


### Bug Fixes

* typos in function names ([05b2f9c](https://github.com/eslint-functional/eslint-plugin-functional/commit/05b2f9c5129807c5aab0d85862e85062bdf0dd2e))

# [6.0.0](https://github.com/eslint-functional/eslint-plugin-functional/compare/v5.0.8...v6.0.0) (2023-07-30)


### Features

* **functional-parameters:** add option to ignore getters and setters ([9c89b9e](https://github.com/eslint-functional/eslint-plugin-functional/commit/9c89b9e4f8960e4ee211b640cd7bb2e3c79b0ed8))
* **immutable-data:** add new option `ignoreNonConstDeclarations` ([ecde24a](https://github.com/eslint-functional/eslint-plugin-functional/commit/ecde24afed487b9b495832ea067c662a0848825a)), closes [#691](https://github.com/eslint-functional/eslint-plugin-functional/issues/691)
* **no-expression-statements:** add option to ignore self returning functions ([894fb91](https://github.com/eslint-functional/eslint-plugin-functional/commit/894fb915b5418e7ee47019b3d7296eee0e307f20)), closes [#611](https://github.com/eslint-functional/eslint-plugin-functional/issues/611)
* **prefer-immutable-types:** use suggestions instead of a fixer by default ([#598](https://github.com/eslint-functional/eslint-plugin-functional/issues/598)) ([3fb9028](https://github.com/eslint-functional/eslint-plugin-functional/commit/3fb902842fa256bde98c0b7fd9c360a6456fd250))
* remove `assumeTypes` option ([6be5862](https://github.com/eslint-functional/eslint-plugin-functional/commit/6be5862a65c65b389f2cc787c93a42b10407938a))
* add sanity checks to type immutablity override settings ([d3ce5b0](https://github.com/eslint-functional/eslint-plugin-functional/commit/d3ce5b0db162af843886489850706c070f375d01))
* replace `ignorePattern` option with `ignoreIdentifierPattern` and `ignoreCodePattern` ([48d8eba](https://github.com/eslint-functional/eslint-plugin-functional/commit/48d8eba1356c54b2e0fa568c5cb2526e224c31ed)), closes [#467](https://github.com/eslint-functional/eslint-plugin-functional/issues/467)


### Build System

* increase minimum supported TypeScript version to 4.3.5 ([aefe6b2](https://github.com/eslint-functional/eslint-plugin-functional/commit/aefe6b2012440d54d006924732975e75ac903716))


### BREAKING CHANGES

* replace `ignorePattern` option with `ignoreIdentifierPattern` and `ignoreCodePattern`
* increase minimum supported TypeScript version to 4.3.5
* remove `assumeTypes` option
* **prefer-immutable-types:** The fixer config no longer inherits as many options as before; be sure to be
explicit in your configs.

## [5.0.8](https://github.com/eslint-functional/eslint-plugin-functional/compare/v5.0.7...v5.0.8) (2023-04-15)


### Bug Fixes

* **prefer-immutable-types:** support private identifier ([#634](https://github.com/eslint-functional/eslint-plugin-functional/issues/634)) ([6349a92](https://github.com/eslint-functional/eslint-plugin-functional/commit/6349a927b6e9f68ed0e2878c896f26234c0144c6))

## [5.0.7](https://github.com/eslint-functional/eslint-plugin-functional/compare/v5.0.6...v5.0.7) (2023-03-21)

## [5.0.6](https://github.com/eslint-functional/eslint-plugin-functional/compare/v5.0.5...v5.0.6) (2023-03-11)


### Bug Fixes

* **type-declaration-immutability:** only allow strings to be given for identifiers ([#573](https://github.com/eslint-functional/eslint-plugin-functional/issues/573)) ([e9f2f90](https://github.com/eslint-functional/eslint-plugin-functional/commit/e9f2f906fb79e5e837f4baf20f1c1d82d583bf17))

## [5.0.5](https://github.com/eslint-functional/eslint-plugin-functional/compare/v5.0.4...v5.0.5) (2023-03-07)


### Bug Fixes

* **no-expression-statements:** allow yield expressions ([#570](https://github.com/eslint-functional/eslint-plugin-functional/issues/570)) ([81c26de](https://github.com/eslint-functional/eslint-plugin-functional/commit/81c26def6bef1828ae2199b9bb0b736b4db7b22a))

## [5.0.4](https://github.com/eslint-functional/eslint-plugin-functional/compare/v5.0.3...v5.0.4) (2023-02-06)


### Bug Fixes

* **prefer-immutable-types:** inheriting of config options ([b528bc7](https://github.com/eslint-functional/eslint-plugin-functional/commit/b528bc7ab30f8461ec335558a65cc546e47ac27f))

## [5.0.3](https://github.com/eslint-functional/eslint-plugin-functional/compare/v5.0.2...v5.0.3) (2023-02-06)


### Bug Fixes

* add missing dependency "@typescript-eslint/type-utils" ([7bd4d03](https://github.com/eslint-functional/eslint-plugin-functional/commit/7bd4d03d90b92f4e94b392876b90c4adddb9380f))

## [5.0.2](https://github.com/eslint-functional/eslint-plugin-functional/compare/v5.0.1...v5.0.2) (2023-02-04)


### Bug Fixes

* **prefer-immutable-types:** handling of destructuring assignment ([e390f54](https://github.com/eslint-functional/eslint-plugin-functional/commit/e390f5430a432e6d3c4812ebaca5ddd909ab9167))

## [5.0.1](https://github.com/eslint-functional/eslint-plugin-functional/compare/v5.0.0...v5.0.1) (2023-02-02)


### Bug Fixes

* improve calculation of immutability involving intersections ([75cd708](https://github.com/eslint-functional/eslint-plugin-functional/commit/75cd7081deab7bc42e7f8d095ca4b5b739defe96)), closes [#525](https://github.com/eslint-functional/eslint-plugin-functional/issues/525)

# [5.0.0](https://github.com/eslint-functional/eslint-plugin-functional/compare/v4.4.1...v5.0.0) (2023-01-29)


### Bug Fixes

* drop dependency on tsutils ([7a63d89](https://github.com/eslint-functional/eslint-plugin-functional/commit/7a63d8971b16e83fa6420776955105cc5325a428))
* fix meta data and improve doc generation ([1f50625](https://github.com/eslint-functional/eslint-plugin-functional/commit/1f506259dd5052447d8c23f583dbd2ca255114d3))
* **no-mixed-types:** add support for TypeLiteral inside `Readonly<>` ([1da622d](https://github.com/eslint-functional/eslint-plugin-functional/commit/1da622d43dc6c0c48213931ddd447895971d8d8a)), closes [#500](https://github.com/eslint-functional/eslint-plugin-functional/issues/500)
* **prefer-immutable-types:** fix `string[]` to `readonly string[]` ([a6a27ff](https://github.com/eslint-functional/eslint-plugin-functional/commit/a6a27ffa41a40d417d1cdaca7100686fd94bad2e))
* **prefer-immutable-types:** improve the fixer ([4bba113](https://github.com/eslint-functional/eslint-plugin-functional/commit/4bba113be8ad20259147cab81e0ab3bccc79c6cd))
* **prefer-tacit:** use suggestions instead of a fixer and improve how that suggestion works ([8473743](https://github.com/eslint-functional/eslint-plugin-functional/commit/8473743446b10bccc7bf175f629fb05fab979e40))
* **type-declaration-immutability:** don't strip whitespace formatting from node text ([8dcaa4d](https://github.com/eslint-functional/eslint-plugin-functional/commit/8dcaa4d92ea6cd0424730b68da7164b49f5b82d4))


### Build System

* bump minimum supported version of node to 16.10 ([23b45d2](https://github.com/eslint-functional/eslint-plugin-functional/commit/23b45d25b252b1b0337c57ef671ae231a17f38d9))
* bump minimum supported version of TypeScript to 4.0.2 ([405102b](https://github.com/eslint-functional/eslint-plugin-functional/commit/405102be6379e7f30c8f3f0e28a43359e65a27e9))


### Features

* add new strict ruleset and reduce strictness of the recommended ruleset ([26424e0](https://github.com/eslint-functional/eslint-plugin-functional/commit/26424e03b1cdeba844893d219e7f950934386b72))
* **functional-parameters:** add option to ignore lambda function expressions ([044e54b](https://github.com/eslint-functional/eslint-plugin-functional/commit/044e54ba646a3f6001a16c3e7b19299efaf49eab))
* **no-classes:** rename rule from `no-class` ([76a8e2d](https://github.com/eslint-functional/eslint-plugin-functional/commit/76a8e2d28e32cfcd5a6477f8552b5fb43442a79d))
* **no-conditional-statements:** rename rule from `no-conditional-statement` ([82b21fa](https://github.com/eslint-functional/eslint-plugin-functional/commit/82b21fa954ec8ead473bbb9bc10273d3cc927e40))
* **no-expression-statements:** rename rule from `no-expression-statement` ([d0f9e98](https://github.com/eslint-functional/eslint-plugin-functional/commit/d0f9e98f451b881a1df69e92ce78abf18f2c76f6))
* **no-loop-statements:** rename rule from `no-loop-statement` ([683209d](https://github.com/eslint-functional/eslint-plugin-functional/commit/683209dd326b6405ecdcbe552aa271788c1a78af))
* **no-method-signature:** rename to `prefer-property-signatures` & move it to `stylistic` ruleset ([da2259f](https://github.com/eslint-functional/eslint-plugin-functional/commit/da2259f2f592b27af9d157e82160c857621750ca))
* **no-mixed-types:** rename rule from `no-mixed-type` ([392f9e8](https://github.com/eslint-functional/eslint-plugin-functional/commit/392f9e8cf10ec2d09222e65f4136cb3480fcadfd))
* **no-this-expression:** remove `no-this-expression` from recommended and lite rulesets ([bbd798b](https://github.com/eslint-functional/eslint-plugin-functional/commit/bbd798b484c17fdb32d45476c88e141402e1377e))
* **no-this-expressions:** rename rule from `no-this-expression` ([10c3bb6](https://github.com/eslint-functional/eslint-plugin-functional/commit/10c3bb6addc9e741296db43f1d464bf6483142c7))
* **no-throw-statements:** rename rule from `no-throw-statement` ([4be92c8](https://github.com/eslint-functional/eslint-plugin-functional/commit/4be92c8c2a485d870704379219f46e7fdb572ca8))
* **no-try-statements:** rename rule from `no-try-statement` ([e88828a](https://github.com/eslint-functional/eslint-plugin-functional/commit/e88828a9755018d7ab1c79a7b33d6cce1912f1c4))
* **prefer-immutable-types:** add fixer for class properties ([5e047c2](https://github.com/eslint-functional/eslint-plugin-functional/commit/5e047c2825d03d57ee1472846ff260831f685173))
* **prefer-immutable-types:** add support for a fixer ([195ee1a](https://github.com/eslint-functional/eslint-plugin-functional/commit/195ee1afcb3459a2ba8ae9e0a3ca9629da8c8c47))
* **prefer-immutable-types:** create rule ([2552d55](https://github.com/eslint-functional/eslint-plugin-functional/commit/2552d554f87c22031471a75d013d5cb3b84e2e40))
* **prefer-immutable-types:** improve ignore options ([8a35e52](https://github.com/eslint-functional/eslint-plugin-functional/commit/8a35e52684cee50d7269cb9442b835f548c3c665))
* **prefer-property-signatures:** rename `ignoreIfReadonly` to `ignoreIfReadonlyWrapped` ([86f354b](https://github.com/eslint-functional/eslint-plugin-functional/commit/86f354badf6dee2359211e1e67b0caf8c1da5430))
* **prefer-readonly-type:** deprecated this rule ([82816a0](https://github.com/eslint-functional/eslint-plugin-functional/commit/82816a03f8af397c0e2de619e55515a504ff2df8))
* **readonly-type:** create rule ([64af937](https://github.com/eslint-functional/eslint-plugin-functional/commit/64af93713e7e5b46f902e5032f13b4e3bf5a8943))
* remove `@typescript-eslint/prefer-readonly-parameter-types` from `external-recommended` ([72aa204](https://github.com/eslint-functional/eslint-plugin-functional/commit/72aa2049413d22559b3f90c479baa66ab3312003))
* rename many of the options ([b47e983](https://github.com/eslint-functional/eslint-plugin-functional/commit/b47e983b822842d1f46824a1e8c98893d45e8cb8))
* rename ruleset `no-object-orientation` to `no-other-paradigms` ([7ec10c6](https://github.com/eslint-functional/eslint-plugin-functional/commit/7ec10c65d1c740697ecc7ca1cf5a9b7f48ed69e2))
* split `external-recommended` rulesets into vanilla and typescript variants ([1e7f77a](https://github.com/eslint-functional/eslint-plugin-functional/commit/1e7f77acb699033d17a9b20cbd9d11e5b85fb5b8))
* **type-declaration-immutability:** add fixer support ([2189397](https://github.com/eslint-functional/eslint-plugin-functional/commit/21893975f899d7df7f23b98aeadab1f56e5a6d29))
* **type-declaration-immutability:** create rule ([941e774](https://github.com/eslint-functional/eslint-plugin-functional/commit/941e774f11ed7473167e1d37020f17e6755e6a7b))
* update ruleset configurations ([c195d8e](https://github.com/eslint-functional/eslint-plugin-functional/commit/c195d8e94886b2250b6ccdaa8849445301814565))


### BREAKING CHANGES

* rename many of the options
* **no-try-statements:** rename rule from `no-try-statement`
* **no-throw-statements:** rename rule from `no-throw-statement`
* **no-this-expressions:** rename rule from `no-this-expression`
* **no-mixed-types:** rename rule from `no-mixed-type`
* **no-loop-statements:** rename rule from `no-loop-statement`
* **no-expression-statements:** rename rule from `no-expression-statement`
* **no-conditional-statements:** rename rule from `no-conditional-statement`
* **no-classes:** rename rule from `no-class`
* **no-this-expression:** remove `no-this-expression` from recommended and lite rulesets
* **prefer-property-signatures:** rename `ignoreIfReadonly` to `ignoreIfReadonlyWrapped` and set it to `false`
by default
* rename ruleset `no-object-orientation` to `no-other-paradigms`
* add new strict ruleset and reduce strictness of the recommended ruleset
* update ruleset configurations
* split `external-recommended` rulesets into vanilla and typescript variants
* remove `@typescript-eslint/prefer-readonly-parameter-types` from `external-recommended`
* **no-method-signature:** rename to `prefer-property-signatures` & move it to `stylistic` ruleset
* bump minimum supported version of TypeScript to 4.0.2
* bump minimum supported version of node to 16.10

## [4.4.1](https://github.com/eslint-functional/eslint-plugin-functional/compare/v4.4.0...v4.4.1) (2022-10-03)


### Bug Fixes

* **prefer-tacit:** handling of member expressions and be more strict with optional parameters ([a277c2a](https://github.com/eslint-functional/eslint-plugin-functional/commit/a277c2a92987407b24b5f232c1c146fba1b7700a)), closes [#486](https://github.com/eslint-functional/eslint-plugin-functional/issues/486)

# [4.4.0](https://github.com/eslint-functional/eslint-plugin-functional/compare/v4.3.2...v4.4.0) (2022-09-20)


### Features

* **functional-parameters:** add support for ignoring selector prefixes ([af3cbcc](https://github.com/eslint-functional/eslint-plugin-functional/commit/af3cbcc26ae282f1c515b6faa56aaced984ae217)), closes [#207](https://github.com/eslint-functional/eslint-plugin-functional/issues/207) [#244](https://github.com/eslint-functional/eslint-plugin-functional/issues/244)

## [4.3.2](https://github.com/eslint-functional/eslint-plugin-functional/compare/v4.3.1...v4.3.2) (2022-09-19)

## [4.3.1](https://github.com/eslint-functional/eslint-plugin-functional/compare/v4.3.0...v4.3.1) (2022-09-14)


### Bug Fixes

* **no-return-void:** check additional ts function types ([3db661d](https://github.com/eslint-functional/eslint-plugin-functional/commit/3db661d34d39e906ecfb489f035272b96265709a))

# [4.3.0](https://github.com/eslint-functional/eslint-plugin-functional/compare/v4.2.2...v4.3.0) (2022-09-08)


### Bug Fixes

* **prefer-tacit:** assign callee to a new variable when autofixing function declarations ([4467d1b](https://github.com/eslint-functional/eslint-plugin-functional/commit/4467d1b98eb15852ea86db7db31bde7193f3055d))


### Features

* **prefer-tacit:** support autofixing function calls with type parameters ([#415](https://github.com/eslint-functional/eslint-plugin-functional/issues/415)) ([e752ced](https://github.com/eslint-functional/eslint-plugin-functional/commit/e752ced76ca0df54bc03f7d6d4fec59fe694c759))

## [4.2.2](https://github.com/eslint-functional/eslint-plugin-functional/compare/v4.2.1...v4.2.2) (2022-07-22)


### Bug Fixes

* typos and tighten a sentence ([9da0455](https://github.com/eslint-functional/eslint-plugin-functional/commit/9da0455bf8cb64db0c7cc59e4c8b61a63dce1c2b))

## [4.2.1](https://github.com/eslint-functional/eslint-plugin-functional/compare/v4.2.0...v4.2.1) (2022-04-06)

# [4.2.0](https://github.com/eslint-functional/eslint-plugin-functional/compare/v4.1.1...v4.2.0) (2022-02-06)


### Features

* **no-throw-statements:** add an option to allow throw statements within async functions ([#330](https://github.com/eslint-functional/eslint-plugin-functional/issues/330)) ([7cee76b](https://github.com/eslint-functional/eslint-plugin-functional/commit/7cee76b0baeeea20dc32546c133b35f2dc12e01d))

## [4.1.1](https://github.com/eslint-functional/eslint-plugin-functional/compare/v4.1.0...v4.1.1) (2022-01-08)


### Bug Fixes

* rules having broken links to docs ([#310](https://github.com/eslint-functional/eslint-plugin-functional/issues/310)) ([0eac036](https://github.com/eslint-functional/eslint-plugin-functional/commit/0eac0367c37b4b5bf3cba1cede2590aa630ed148))

# [4.1.0](https://github.com/eslint-functional/eslint-plugin-functional/compare/v4.0.2...v4.1.0) (2022-01-08)


### Features

* **no-let:** add option to allow lets inside of for loop initializers ([#306](https://github.com/eslint-functional/eslint-plugin-functional/issues/306)) ([71769f3](https://github.com/eslint-functional/eslint-plugin-functional/commit/71769f3f4c9cda0b30fd2ec440c89b99a7c5297f))

## [4.0.2](https://github.com/eslint-functional/eslint-plugin-functional/compare/v4.0.1...v4.0.2) (2021-10-24)


### Bug Fixes

* get the coorect identifier text of values in object expressions ([#285](https://github.com/eslint-functional/eslint-plugin-functional/issues/285)) ([a267af6](https://github.com/eslint-functional/eslint-plugin-functional/commit/a267af6267e4e4c1b76a272520249654555f75df))
* off config no longer contains "overrides" ([#286](https://github.com/eslint-functional/eslint-plugin-functional/issues/286)) ([5ad533d](https://github.com/eslint-functional/eslint-plugin-functional/commit/5ad533d4d750624fa5791fd9d8a53292e3991846))

## [4.0.1](https://github.com/eslint-functional/eslint-plugin-functional/compare/v4.0.0...v4.0.1) (2021-10-24)


### Bug Fixes

* ignore pattern - "id" and "key" values are only used if defined ([77d6dd6](https://github.com/eslint-functional/eslint-plugin-functional/commit/77d6dd6780bff54c97b560a66b902b5655bee1e6))

# [4.0.0](https://github.com/eslint-functional/eslint-plugin-functional/compare/v3.7.2...v4.0.0) (2021-10-17)


### Bug Fixes

* bring rule meta data "recommended" into line with the recommend config ([3c4a042](https://github.com/eslint-functional/eslint-plugin-functional/commit/3c4a042767aaccc55b76f42a5a1efb1e4b35d172))


### chore

* remove deprecated rule: prefer-type-literal ([3a54331](https://github.com/eslint-functional/eslint-plugin-functional/commit/3a543312388232a2348545ae7ab7ab18965e3282))
* remove deprecated stylitic ruleset ([2b96760](https://github.com/eslint-functional/eslint-plugin-functional/commit/2b967606b065eac90b13fe24524c433401736440))
* update minimum required node version to 12 ([97acb3f](https://github.com/eslint-functional/eslint-plugin-functional/commit/97acb3fa8fd82a600861637e540cf1d8bf3a7ce3))


### Features

* add an off preset ([686b7fe](https://github.com/eslint-functional/eslint-plugin-functional/commit/686b7fe581fe6d451c53f3a84d95338f2e1c5ede))
* add stylistic rules to lite and recommended rule sets ([b81b4c7](https://github.com/eslint-functional/eslint-plugin-functional/commit/b81b4c72e86d97768a16e64faedf0b53ffad10d5))
* **external-recommended:** update recommended external rules ([353acb3](https://github.com/eslint-functional/eslint-plugin-functional/commit/353acb34e08bb5e92e682793dd515e2af072e1c6))
* **no-return-void:** implicit types are now checked by default ([2adbe14](https://github.com/eslint-functional/eslint-plugin-functional/commit/2adbe14ac4f91e8c49eca59c785ca5ba3cf070a7))
* **prefer-tacit:** disable prefer-tacit by default in recommended and lite configs ([6f9204d](https://github.com/eslint-functional/eslint-plugin-functional/commit/6f9204dadaff56ebde5d69c7dbce001a3bd47e94))


### BREAKING CHANGES

* **no-return-void:** implicit types are now checked by default
* **external-recommended:** update recommended external rules
* rule "prefer-type-literal" has been removed.
* removed stylitic ruleset in favor of stylistic ruleset
* Node ^12.22.0 or ^14.17.0 or >=16.0.0 is now required

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Generated by [`auto-changelog`](https://github.com/CookPete/auto-changelog).

## [v3.7.2](https://github.com/eslint-functional/eslint-plugin-functional/compare/v3.7.1...v3.7.2)

### Fixed

- fix(no-conditional-statements): break/continue are no longer treated as returning inside of a switch [`#272`](https://github.com/eslint-functional/eslint-plugin-functional/issues/272)

## [v3.7.1](https://github.com/eslint-functional/eslint-plugin-functional/compare/v3.7.0...v3.7.1) - 2021-09-20

### Fixed

- fix(no-conditional-statements): branch with break/continue statements now treated as returning branch [`#269`](https://github.com/eslint-functional/eslint-plugin-functional/issues/269)

## [v3.7.0](https://github.com/eslint-functional/eslint-plugin-functional/compare/v3.6.0...v3.7.0) - 2021-08-28

### Commits

- refactor: change implementation to not to be selector-based as requested [`8350384`](https://github.com/eslint-functional/eslint-plugin-functional/commit/8350384727acde71e7664022a7afa96662c5d821)
- feat(no-method-signature): properly handle `Readonly&lt;{TSMethodSignature}&gt;` [`18d178f`](https://github.com/eslint-functional/eslint-plugin-functional/commit/18d178fa0efd7b59e46e38452dc825ba9c3cd472)
- feat: add option `ignoreIfReadonly` [`2d4963b`](https://github.com/eslint-functional/eslint-plugin-functional/commit/2d4963b483c52fa0c01729bcb2d67a03b7121b6a)

## [v3.6.0](https://github.com/eslint-functional/eslint-plugin-functional/compare/v3.5.0...v3.6.0) - 2021-08-13

### Merged

- Use pull_request_target [`#254`](https://github.com/eslint-functional/eslint-plugin-functional/pull/254)

### Fixed

- feat(no-expression-statements): add option ignoreVoid [`#71`](https://github.com/eslint-functional/eslint-plugin-functional/issues/71)
- docs: update tslint migration guide [`#214`](https://github.com/eslint-functional/eslint-plugin-functional/issues/214)

## [v3.5.0](https://github.com/eslint-functional/eslint-plugin-functional/compare/v3.4.1...v3.5.0) - 2021-08-01

### Commits

- feat(no-return-void): add option to allow for checking implicit return types [`6fb1604`](https://github.com/eslint-functional/eslint-plugin-functional/commit/6fb16047aaa7712d537d64ee26728a0cc85cf0cf)
- docs: update readme for using with typescript [`ba8fe86`](https://github.com/eslint-functional/eslint-plugin-functional/commit/ba8fe865bd5e21dcd072dd3f0f727d05420217e2)
- build(deps-dev): bump tsutils from 3.17.1 to 3.21.0 [`1c921ea`](https://github.com/eslint-functional/eslint-plugin-functional/commit/1c921ea559809ea653c9ed04549fedea8d690273)

## [v3.4.1](https://github.com/eslint-functional/eslint-plugin-functional/compare/v3.4.0...v3.4.1) - 2021-07-31

### Commits

- feat(no-conditional-statements): allow switches that exhaust all types [`35a72f1`](https://github.com/eslint-functional/eslint-plugin-functional/commit/35a72f1f9243aa5207851df1b5e5c25f0918e3bc)

## [v3.4.0](https://github.com/eslint-functional/eslint-plugin-functional/compare/v3.3.0...v3.4.0) - 2021-07-31

### Merged

- docs: enable github discussions and remove link to spectrum [`#238`](https://github.com/eslint-functional/eslint-plugin-functional/pull/238)

### Fixed

- fix(prefer-tacit): cannot read property 'type' of undefined [`#221`](https://github.com/eslint-functional/eslint-plugin-functional/issues/221) [`#194`](https://github.com/eslint-functional/eslint-plugin-functional/issues/194)
- fix(prefer-readonly-type): allow inline mutable return types [`#98`](https://github.com/eslint-functional/eslint-plugin-functional/issues/98)
- fix(prefer-readonly-type): computed property fixer [`#200`](https://github.com/eslint-functional/eslint-plugin-functional/issues/200)

## [v3.3.0](https://github.com/eslint-functional/eslint-plugin-functional/compare/v3.2.2...v3.3.0) - 2021-07-27

### Fixed

- feat(no-conditional-statements): support never-returning functions for option allowReturningBranches [`#99`](https://github.com/eslint-functional/eslint-plugin-functional/issues/99)

## [v3.2.2](https://github.com/eslint-functional/eslint-plugin-functional/compare/v3.2.1...v3.2.2) - 2021-07-23

### Fixed

- fix(prefer-type-literal): deprecated rule [`#170`](https://github.com/eslint-functional/eslint-plugin-functional/issues/170)

## [v3.2.1](https://github.com/eslint-functional/eslint-plugin-functional/compare/v3.1.0...v3.2.1) - 2021-01-01

### Merged

- build(deps-dev): bump @typescript-eslint/eslint-plugin from 4.9.1 to 4.11.1 [`#175`](https://github.com/eslint-functional/eslint-plugin-functional/pull/175)
- build(deps-dev): bump @rollup/plugin-typescript from 8.0.0 to 8.1.0 [`#164`](https://github.com/eslint-functional/eslint-plugin-functional/pull/164)
- build(deps): bump @typescript-eslint/experimental-utils from 4.9.1 to 4.11.0 [`#162`](https://github.com/eslint-functional/eslint-plugin-functional/pull/162)
- build(deps-dev): bump eslint from 7.15.0 to 7.16.0 [`#163`](https://github.com/eslint-functional/eslint-plugin-functional/pull/163)
- build(deps-dev): bump @typescript-eslint/parser from 4.9.1 to 4.11.0 [`#165`](https://github.com/eslint-functional/eslint-plugin-functional/pull/165)
- build(deps-dev): bump rollup from 2.34.2 to 2.35.1 [`#166`](https://github.com/eslint-functional/eslint-plugin-functional/pull/166)
- Automerge dependabot updates [`#167`](https://github.com/eslint-functional/eslint-plugin-functional/pull/167)
- chore: configure github settings [`#161`](https://github.com/eslint-functional/eslint-plugin-functional/pull/161)
- refactor: general tidy up of code and configs [`#149`](https://github.com/eslint-functional/eslint-plugin-functional/pull/149)

## [v3.1.0](https://github.com/eslint-functional/eslint-plugin-functional/compare/v3.0.2...v3.1.0) - 2020-10-08

### Commits

- feat(prefer-readonly-type): add option ignoreCollections [`ad53072`](https://github.com/eslint-functional/eslint-plugin-functional/commit/ad530729488bdab9c41db58cc4152a338d229a94)
- docs(prefer-type-literal): remove mention of removed option allowLocalMutation from docs [`c4b4051`](https://github.com/eslint-functional/eslint-plugin-functional/commit/c4b4051c4145e9bab708c21079aabffa4d30c3cf)

## [v3.0.2](https://github.com/eslint-functional/eslint-plugin-functional/compare/v3.0.1...v3.0.2) - 2020-08-23

### Merged

- improvement(prefer-type-literal): remove option allowLocalMutation [`#148`](https://github.com/eslint-functional/eslint-plugin-functional/pull/148)
- build(deps-dev): add peer dependencies [`#147`](https://github.com/eslint-functional/eslint-plugin-functional/pull/147)
- build(deps-peer): update typescript [`#146`](https://github.com/eslint-functional/eslint-plugin-functional/pull/146)
- build(deps-dev): update jest [`#145`](https://github.com/eslint-functional/eslint-plugin-functional/pull/145)
- build(deps-dev): bump eslint [`#144`](https://github.com/eslint-functional/eslint-plugin-functional/pull/144)
- build(deps-dev): bump typescript from 3.7.4 to 4.0.2 [`#141`](https://github.com/eslint-functional/eslint-plugin-functional/pull/141)
- build(deps-dev): bump lint-staged from 9.5.0 to 10.2.11 [`#135`](https://github.com/eslint-functional/eslint-plugin-functional/pull/135)
- build(deps-dev): bump rollup-plugin-typescript2 from 0.25.3 to 0.27.2 [`#139`](https://github.com/eslint-functional/eslint-plugin-functional/pull/139)
- build(deps-dev): bump shelljs from 0.8.3 to 0.8.4 [`#140`](https://github.com/eslint-functional/eslint-plugin-functional/pull/140)
- build(deps-dev): bump rollup from 1.29.0 to 2.26.5 [`#138`](https://github.com/eslint-functional/eslint-plugin-functional/pull/138)
- build(deps-dev): bump rimraf from 3.0.0 to 3.0.2 [`#137`](https://github.com/eslint-functional/eslint-plugin-functional/pull/137)
- build(deps-dev): bump husky from 4.0.6 to 4.2.5 [`#134`](https://github.com/eslint-functional/eslint-plugin-functional/pull/134)
- build(deps-dev): bump eslint-plugin-prettier from 3.1.2 to 3.1.4 [`#133`](https://github.com/eslint-functional/eslint-plugin-functional/pull/133)
- build(deps-dev): bump eslint-plugin-jsdoc from 20.1.0 to 30.2.4 [`#132`](https://github.com/eslint-functional/eslint-plugin-functional/pull/132)
- build(deps-dev): bump eslint-plugin-jest from 23.4.0 to 23.20.0 [`#131`](https://github.com/eslint-functional/eslint-plugin-functional/pull/131)
- build(deps-dev): bump babel-eslint from 10.0.3 to 10.1.0 [`#126`](https://github.com/eslint-functional/eslint-plugin-functional/pull/126)
- build(deps-dev): bump eslint-plugin-import from 2.20.0 to 2.22.0 [`#130`](https://github.com/eslint-functional/eslint-plugin-functional/pull/130)
- build(deps-dev): bump eslint-plugin-eslint-plugin from 2.2.0 to 2.3.0 [`#129`](https://github.com/eslint-functional/eslint-plugin-functional/pull/129)
- build(deps-dev): bump eslint-config-prettier from 6.9.0 to 6.11.0 [`#128`](https://github.com/eslint-functional/eslint-plugin-functional/pull/128)
- build(deps-dev): bump codecov from 3.7.1 to 3.7.2 [`#127`](https://github.com/eslint-functional/eslint-plugin-functional/pull/127)
- build(deps-dev): bump auto-changelog from 1.16.2 to 2.2.0 [`#125`](https://github.com/eslint-functional/eslint-plugin-functional/pull/125)
- build(deps-dev): bump @typescript-eslint/parser from 2.15.0 to 2.34.0 [`#124`](https://github.com/eslint-functional/eslint-plugin-functional/pull/124)
- build(deps-dev): bump @typescript-eslint/eslint-plugin from 2.15.0 to 2.34.0 [`#123`](https://github.com/eslint-functional/eslint-plugin-functional/pull/123)
- build(deps-dev): bump @types/estree from 0.0.42 to 0.0.45 [`#119`](https://github.com/eslint-functional/eslint-plugin-functional/pull/119)
- build(deps-dev): bump @types/jest from 24.0.25 to 26.0.10 [`#121`](https://github.com/eslint-functional/eslint-plugin-functional/pull/121)
- build(deps-dev): bump @types/glob from 7.1.1 to 7.1.3 [`#120`](https://github.com/eslint-functional/eslint-plugin-functional/pull/120)
- build(deps-dev): bump @types/eslint from 6.1.3 to 7.2.1 [`#118`](https://github.com/eslint-functional/eslint-plugin-functional/pull/118)
- build(deps): bump escape-string-regexp from 2.0.0 to 4.0.0 [`#117`](https://github.com/eslint-functional/eslint-plugin-functional/pull/117)
- Faster CI [`#142`](https://github.com/eslint-functional/eslint-plugin-functional/pull/142)
- fix(prefer-readonly-type): add support for mapped types  [`#107`](https://github.com/eslint-functional/eslint-plugin-functional/pull/107)
- fix(immutable-data): add support for ignoring exceptions for update expressions [`#108`](https://github.com/eslint-functional/eslint-plugin-functional/pull/108)
- fix(type guard): cast with `as` as the type guard doesn't seem to be working correctly anymore [`#111`](https://github.com/eslint-functional/eslint-plugin-functional/pull/111)
- improvement(no-mixed-types): rule violations now mark the type as wrong, not members of the type [`#93`](https://github.com/eslint-functional/eslint-plugin-functional/pull/93)
- Reduce use of .reduce() [`#92`](https://github.com/eslint-functional/eslint-plugin-functional/pull/92)

### Fixed

- improvement(prefer-type-literal): remove option allowLocalMutation [`#87`](https://github.com/eslint-functional/eslint-plugin-functional/issues/87)
- fix(prefer-readonly-type): add support for mapped types [`#106`](https://github.com/eslint-functional/eslint-plugin-functional/issues/106)
- fix(immutable-data): add support for ignoring exceptions for UpdateExpression [`#97`](https://github.com/eslint-functional/eslint-plugin-functional/issues/97)

## [v3.0.1](https://github.com/eslint-functional/eslint-plugin-functional/compare/v3.0.0...v3.0.1) - 2020-01-12

### Commits

- docs(changelog): update changelog for v3.0.0 [`d248311`](https://github.com/eslint-functional/eslint-plugin-functional/commit/d248311afb21ce3c976dc44d69bafa9327602ff0)
- build: auto changelog changes are now part of the same git commit as the release [`7c369c8`](https://github.com/eslint-functional/eslint-plugin-functional/commit/7c369c89436c2b27177eafe5d56d6ce2f48b0402)
- docs(readme): fix issue with svg image not displaying on npmjs [`aa4f573`](https://github.com/eslint-functional/eslint-plugin-functional/commit/aa4f57304c2e9b81ba7484a8b5d8edc08e979024)

## [v3.0.0](https://github.com/eslint-functional/eslint-plugin-functional/compare/v2.0.0...v3.0.0) - 2020-01-12

### Merged

- set up auto-changelog so we don't have to do it manually [`#90`](https://github.com/eslint-functional/eslint-plugin-functional/pull/90)
- Dependency Update. [`#89`](https://github.com/eslint-functional/eslint-plugin-functional/pull/89)
- Examples of correct/incorrect code for each rule [`#60`](https://github.com/eslint-functional/eslint-plugin-functional/pull/60)
- docs: rename 'allow-pattern.md' to 'ignore-pattern.md' [`#88`](https://github.com/eslint-functional/eslint-plugin-functional/pull/88)
- Prettier readme [`#85`](https://github.com/eslint-functional/eslint-plugin-functional/pull/85)
- Additional tests [`#86`](https://github.com/eslint-functional/eslint-plugin-functional/pull/86)

### Commits

- **Breaking change:** build(dep): update all dependencies [`ce90405`](https://github.com/eslint-functional/eslint-plugin-functional/commit/ce904054e3d29bcd7bae74756c844221acc10695)

## [v2.0.0](https://github.com/eslint-functional/eslint-plugin-functional/compare/v1.0.3...v2.0.0) - 2019-12-29

### Merged

- build(deps): bump handlebars from 4.1.2 to 4.5.3 [`#84`](https://github.com/eslint-functional/eslint-plugin-functional/pull/84)
- Do not enforce a parameter count by default in the lite ruleset [`#83`](https://github.com/eslint-functional/eslint-plugin-functional/pull/83)
- Add a section to explicitly list all the rulesets [`#77`](https://github.com/eslint-functional/eslint-plugin-functional/pull/77)
- no longer include external recommended rules in the rulesets; put them in their own ruleset [`#80`](https://github.com/eslint-functional/eslint-plugin-functional/pull/80)

### Fixed

- **Breaking change:** feat(functional-parameters): do not enforce a parameter count by default in the lite ruleset [`#79`](https://github.com/eslint-functional/eslint-plugin-functional/issues/79)

### Commits

- fix: fix config type infor [`0c4e097`](https://github.com/eslint-functional/eslint-plugin-functional/commit/0c4e0976a5f3428e750d0e2876d115f21e29eb4c)

## [v1.0.3](https://github.com/eslint-functional/eslint-plugin-functional/compare/v1.0.2...v1.0.3) - 2019-12-29

### Merged

- Local mutation in a function now only refers to within the function's body [`#78`](https://github.com/eslint-functional/eslint-plugin-functional/pull/78)
- no-mixed-interface rule does not exist anymore [`#81`](https://github.com/eslint-functional/eslint-plugin-functional/pull/81)

### Fixed

- fix(prefer-readonly-type): local mutation in a function only refers to within the function's body [`#75`](https://github.com/eslint-functional/eslint-plugin-functional/issues/75)

## [v1.0.2](https://github.com/eslint-functional/eslint-plugin-functional/compare/v1.0.1...v1.0.2) - 2019-12-11

### Merged

- feat(no-expression-statements): allow specifying directive prologues [`#74`](https://github.com/eslint-functional/eslint-plugin-functional/pull/74)

### Fixed

- fix(no-expression-statements): allow specifying directive prologues [`#68`](https://github.com/eslint-functional/eslint-plugin-functional/issues/68)

## [v1.0.1](https://github.com/eslint-functional/eslint-plugin-functional/compare/v1.0.0...v1.0.1) - 2019-12-11

### Merged

- fix(typeguards): only assume types if type information is not avaliable [`#73`](https://github.com/eslint-functional/eslint-plugin-functional/pull/73)
- docs(readme): change tslint-immutable to eslint-plugin-functional #66 [`#69`](https://github.com/eslint-functional/eslint-plugin-functional/pull/69)
- docs(readme): fix typos [`#70`](https://github.com/eslint-functional/eslint-plugin-functional/pull/70)

### Fixed

- fix(typeguards): only assume types if type information is not avaliable [`#72`](https://github.com/eslint-functional/eslint-plugin-functional/issues/72)

## [v1.0.0](https://github.com/eslint-functional/eslint-plugin-functional/compare/v1.0.0-rc.2...v1.0.0) - 2019-10-14

### Merged

- Upgrade typescript-eslint packages [`#65`](https://github.com/eslint-functional/eslint-plugin-functional/pull/65)
- Rename to no-mutations [`#62`](https://github.com/eslint-functional/eslint-plugin-functional/pull/62)

## [v1.0.0-rc.2](https://github.com/eslint-functional/eslint-plugin-functional/compare/v1.0.0-rc.1...v1.0.0-rc.2) - 2019-08-07

### Fixed

- fix(prefer-readonly-type): index signatures in type literals can now be ignored [`#56`](https://github.com/eslint-functional/eslint-plugin-functional/issues/56)

## [v1.0.0-rc.1](https://github.com/eslint-functional/eslint-plugin-functional/compare/v0.5.3...v1.0.0-rc.1) - 2019-08-07

### Merged

- fix(immutable-data): Implement option ignoreImmediateMutation [`#59`](https://github.com/eslint-functional/eslint-plugin-functional/pull/59)
- Rename Options [`#55`](https://github.com/eslint-functional/eslint-plugin-functional/pull/55)
- Fix #56 [`#57`](https://github.com/eslint-functional/eslint-plugin-functional/pull/57)
- tslint migration guide [`#54`](https://github.com/eslint-functional/eslint-plugin-functional/pull/54)
- Rename Rules [`#53`](https://github.com/eslint-functional/eslint-plugin-functional/pull/53)

### Fixed

- Merge pull request #57 from jonaskello/issue-56 [`#56`](https://github.com/eslint-functional/eslint-plugin-functional/issues/56)

## [v0.5.3](https://github.com/eslint-functional/eslint-plugin-functional/compare/v0.5.2...v0.5.3) - 2019-08-03

### Fixed

- fix(immutable-data): ignore call expressions on ignored arrays [`#56`](https://github.com/eslint-functional/eslint-plugin-functional/issues/56)

## [v0.5.2](https://github.com/eslint-functional/eslint-plugin-functional/compare/v0.5.1...v0.5.2) - 2019-07-31

### Merged

- Ignore Pattern Improvements [`#52`](https://github.com/eslint-functional/eslint-plugin-functional/pull/52)

## [v0.5.1](https://github.com/eslint-functional/eslint-plugin-functional/compare/v0.5.0...v0.5.1) - 2019-07-30

### Merged

- feat(no-try): Add options allowCatch and allowFinally. [`#50`](https://github.com/eslint-functional/eslint-plugin-functional/pull/50)

### Fixed

- build: Remove @typescript-eslint as a dependency and thus remove typescript as a dependency. [`#49`](https://github.com/eslint-functional/eslint-plugin-functional/issues/49)

## [v0.5.0](https://github.com/eslint-functional/eslint-plugin-functional/compare/v0.4.0...v0.5.0) - 2019-07-29

### Merged

- Refactor out the checkNode function for createRule. [`#48`](https://github.com/eslint-functional/eslint-plugin-functional/pull/48)
- Text matching of MemberExpression nodes now includes the property name [`#47`](https://github.com/eslint-functional/eslint-plugin-functional/pull/47)
- Test configs [`#43`](https://github.com/eslint-functional/eslint-plugin-functional/pull/43)
- feat(no-mixed-types): no-mixed-interface -&gt; no-mixed-types [`#42`](https://github.com/eslint-functional/eslint-plugin-functional/pull/42)
- feat(configs): Create additional configs for each category of rules. [`#40`](https://github.com/eslint-functional/eslint-plugin-functional/pull/40)
- feat(functional-parameters): Add option to allow iifes [`#39`](https://github.com/eslint-functional/eslint-plugin-functional/pull/39)
- new rule: prefer-type [`#38`](https://github.com/eslint-functional/eslint-plugin-functional/pull/38)

### Fixed

- feat(functional-parameters): Add option to allow iifes [`#37`](https://github.com/eslint-functional/eslint-plugin-functional/issues/37)

### Commits

- **Breaking change:** feat(ignore options): text matching MemberExpression nodes should include the property name [`f4ab878`](https://github.com/eslint-functional/eslint-plugin-functional/commit/f4ab878dc885e3286bb799090001af1527adab4f)

## [v0.4.0](https://github.com/eslint-functional/eslint-plugin-functional/compare/v0.3.0...v0.4.0) - 2019-07-19

### Merged

- Rename the package [`#36`](https://github.com/eslint-functional/eslint-plugin-functional/pull/36)

## [v0.3.0](https://github.com/eslint-functional/eslint-plugin-functional/compare/v0.2.1...v0.3.0) - 2019-07-19

### Merged

- ReadonlySet and ReadonlyMap [`#30`](https://github.com/eslint-functional/eslint-plugin-functional/pull/30)
- prefer-readonly-types [`#29`](https://github.com/eslint-functional/eslint-plugin-functional/pull/29)
- no-return-void [`#28`](https://github.com/eslint-functional/eslint-plugin-functional/pull/28)
- functional-parameters [`#27`](https://github.com/eslint-functional/eslint-plugin-functional/pull/27)
- feat(readonly-keyword) Add support for parameter properties [`#26`](https://github.com/eslint-functional/eslint-plugin-functional/pull/26)
- no-conditional-statements [`#23`](https://github.com/eslint-functional/eslint-plugin-functional/pull/23)
- chore: Remove no-delete rule. [`#21`](https://github.com/eslint-functional/eslint-plugin-functional/pull/21)
- new rule: immutable-data [`#22`](https://github.com/eslint-functional/eslint-plugin-functional/pull/22)

### Fixed

- feat(immutable-data): Prevent object mutation methods. [`#16`](https://github.com/eslint-functional/eslint-plugin-functional/issues/16)

## [v0.2.1](https://github.com/eslint-functional/eslint-plugin-functional/compare/v0.2.0...v0.2.1) - 2019-07-12

### Merged

- Remove no-let fixer [`#14`](https://github.com/eslint-functional/eslint-plugin-functional/pull/14)

## [v0.2.0](https://github.com/eslint-functional/eslint-plugin-functional/compare/v0.1.0...v0.2.0) - 2019-07-12

### Merged

- docs: Update supported rules. [`#8`](https://github.com/eslint-functional/eslint-plugin-functional/pull/8)
- Make the code more functional [`#9`](https://github.com/eslint-functional/eslint-plugin-functional/pull/9)
- Added ignoreAccessorPattern, ignorePattern now uses Regex matching [`#7`](https://github.com/eslint-functional/eslint-plugin-functional/pull/7)
- Ignore option fix [`#6`](https://github.com/eslint-functional/eslint-plugin-functional/pull/6)
- Consistent file casing [`#5`](https://github.com/eslint-functional/eslint-plugin-functional/pull/5)
- WIP: Port docs for each rule [`#3`](https://github.com/eslint-functional/eslint-plugin-functional/pull/3)

### Fixed

- **Breaking change:** feat(ignore-option): Add ignoreAccessorPattern option to deal with accessors and switch ignorePatter [`#4`](https://github.com/eslint-functional/eslint-plugin-functional/issues/4)

### Commits

- chore(no-array-mutation): Port of rule. [`48d6c71`](https://github.com/eslint-functional/eslint-plugin-functional/commit/48d6c718efd3275b90164571de7a265498c034d9)

## v0.1.0 - 2019-07-01

### Merged

- Update readme for eslint [`#2`](https://github.com/eslint-functional/eslint-plugin-functional/pull/2)
