# Prefer readonly types over mutable types (prefer-readonly-type-declaration)

This rule enforces use of readonly type declarations.

## Rule Details

This rule checks that declared types are deeply readonly (unless declared to not be).

It can also be used to enforce a naming convention for readonly vs mutable type aliases and interfaces.

Examples of **incorrect** code for this rule:

<!-- eslint-skip -->

```ts
/* eslint functional/prefer-readonly-type-declaration: "error" */

type Point = {
  x: number;
  y: number;
};

const point: Point = { x: 23, y: 44 };
point.x = 99;
```

Examples of **correct** code for this rule:

```ts
/* eslint functional/prefer-readonly-type-declaration: "error" */

type Point = {
  readonly x: number;
  readonly y: number;
};
const point1: Point = { x: 23, y: 44 };
const transformedPoint1 = { ...point, x: 99 };

type MutablePoint = {
  x: number;
  y: number;
};
const point2: MutablePoint = { x: 23, y: 44 };
point2.x = 99;
```

## Options

This rule accepts an options object of the following type:

```ts
type Options = {
  allowLocalMutation: boolean;
  functionReturnTypes: "ignore" | "immutable";
  ignoreAliasPatterns: string[] | string;
  ignoreClass: boolean | "fieldsOnly";
  ignoreCollections: boolean;
  ignoreInterface: boolean;
  ignorePattern?: string[] | string;
  mutableAliasPatterns: string[] | string;
  readonlyAliasPatterns: string[] | string;
  readonlynessOptions: ReadonlynessOptions;
}
```

The default options:

```ts
const defaults = {
  allowLocalMutation: false,
  functionReturnTypes: "ignore",
  ignoreAliasPatterns: "^Mutable$",
  ignoreClass: false,
  ignoreCollections: false,
  ignoreInterface: false,
  mutableAliasPatterns: "^I?Mutable.+$",
  readonlyAliasPatterns: "^(?!I?Mutable).+$",
  readonlynessOptions: readonlynessOptionsDefaults,
}
```

Note: the `lite` ruleset overrides the following default options:

```ts
const liteDefaults = {
  readonlyAliasPatterns: "^I?Readonly.+$",
}
```

### `functionReturnTypes`

Determines the requirements that should be enforced on function return types.

For parameters use [`@typescript-eslint/prefer-readonly-parameter-types`](https://typescript-eslint.io/rules/prefer-readonly-parameter-types)

### `ignoreClass`

If set, classes will not be checked.

Examples of **incorrect** code for the `{ "ignoreClass": false }` option:

<!-- eslint-skip -->

```ts
/* eslint functional/prefer-readonly-type-declaration: ["error", { "ignoreClass": false }] */

class {
  myprop: string;
}
```

Examples of **correct** code for the `{ "ignoreClass": true }` option:

```ts
/* eslint functional/prefer-readonly-type-declaration: ["error", { "ignoreClass": true }] */

class {
  myprop: string;
}
```

### `ignoreInterface`

If set, interfaces will not be checked.

Examples of **incorrect** code for the `{ "ignoreInterface": false }` option:

<!-- eslint-skip -->

```ts
/* eslint functional/prefer-readonly-type-declaration: ["error", { "ignoreInterface": false }] */

interface I {
  myprop: string;
}
```

Examples of **correct** code for the `{ "ignoreInterface": true }` option:

```ts
/* eslint functional/prefer-readonly-type-declaration: ["error", { "ignoreInterface": true }] */

interface I {
  myprop: string;
}
```

### `ignoreCollections`

If set, collections (Array, Tuple, Set, and Map) will not be required to be readonly when used outside of type aliases and interfaces.

Examples of **incorrect** code for the `{ "ignoreCollections": false }` option:

<!-- eslint-skip -->

```ts
/* eslint functional/prefer-readonly-type-declaration: ["error", { "ignoreCollections": false }] */

const foo: number[] = [];
const bar: [string, string] = ["foo", "bar"];
const baz: Set<string, string> = new Set();
const qux: Map<string, string> = new Map();
```

Examples of **correct** code for the `{ "ignoreCollections": true }` option:

```ts
/* eslint functional/prefer-readonly-type-declaration: ["error", { "ignoreCollections": true }] */

const foo: number[] = [];
const bar: [string, string] = ["foo", "bar"];
const baz: Set<string, string> = new Set();
const qux: Map<string, string> = new Map();
```

### `readonlyAliasPatterns` and `mutableAliasPatterns`

These options apply only to type aliases and interface declarations.

The regex pattern(s) specified here are used to test against the type's name.
If it's a match then for `readonlyAliasPatterns` the type must be deeply readonly; for `mutableAliasPatterns` the type must be **not** deeply readonly;.

These options can be set to an empty array to disable this check.

#### Common configs for these options

Require all type aliases and interfaces to be deeply readonly unless prefixed with "Mutable".\
This is the default config.

```jsonc
{
  "readonlyAliasPatterns": "^(?!I?Mutable).+$",
  "mutableAliasPatterns": "^I?Mutable.+$",
}
```

Require all deeply readonly type aliases and interfaces to be prefixed with "Readonly".

```jsonc
{
  "readonlyAliasPatterns": "^I?Readonly.+$",
  "mutableAliasPatterns": "^(?!I?Readonly).+$",
}
```

Require all type aliases and interfaces to be explicity prefixed with either "Readonly" or "Mutable".

```jsonc
{
  "readonlyAliasPatterns": "^I?Readonly.+$",
  "mutableAliasPatterns": "^I?Mutable.+$",
}
```

### `ignoreAliasPatterns`

Any type alias or interface declaration that matches one of these patterns will be ignored for readonlyness.

### `readonlynessOptions`

See [`@typescript-eslint/type-utils`'s `isTypeReadonly`'s options](https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/type-utils/src/isTypeReadonly.ts).

### `allowLocalMutation`

See the [allowLocalMutation](./options/allow-local-mutation.md) docs.

### `ignorePattern`

Use the given regex pattern(s) to match against the type's name (for objects this is the property's name not the object's name).

Note: If using this option to require mutable properties are marked as mutable via a naming convention (e.g. `{ "ignorePattern": "^[Mm]utable.+" }`),
type aliases and interfaces names will still need to comply with the `readonlyAliasPatterns` and `mutableAliasPatterns` options.

See the [ignorePattern](./options/ignore-pattern.md) docs for more info.
