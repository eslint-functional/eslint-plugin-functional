# Disallow mutating objects and arrays (immutable-data)

This rule prohibits syntax that mutates existing objects and arrays via assignment to or deletion of their properties/elements.

## Rule Details

While requiring the `readonly` modifier forces declared types to be immutable,
it won't stop assignment into or modification of untyped objects or external types declared under different rules.

Examples of **incorrect** code for this rule:

```js
/* eslint functional/immutable-data: "error" */

const obj = { foo: 1 };

obj.foo += 2; // <- Modifying an existing object/array is not allowed.
obj.bar = 1; // <- Modifying an existing object/array is not allowed.
delete obj.foo; // <- Modifying an existing object/array is not allowed.
Object.assign(obj, { bar: 2 }); // <- Modifying properties of existing object not allowed.
```

```js
/* eslint functional/immutable-data: "error" */

const arr = [0, 1, 2];

arr[0] = 4; // <- Modifying an array is not allowed.
arr.length = 1; // <- Modifying an array is not allowed.
arr.push(3); // <- Modifying an array is not allowed.
```

Examples of **correct** code for this rule:

```js
/* eslint functional/immutable-data: "error" */

const obj = { foo: 1 };
const arr = [0, 1, 2];

const x = {
  ...obj
  bar: [
    ...arr, 3, 4
  ]
}
```

## Options

This rule accepts an options object of the following type:

```ts
{
  assumeTypes:
    | boolean
    | {
        forArrays: boolean;
        forObjects: boolean;
      }
  ignoreClass: boolean | "fieldsOnly";
  ignoreImmediateMutation: boolean;
  ignorePattern?: string | Array<string>;
  ignoreAccessorPattern?: string | Array<string>;
}
```

The default options:

```ts
{
  assumeTypes: true,
  ignoreClass: false,
  ignoreImmediateMutation: true,
};
```

Note: the `lite` ruleset overrides the default options to:

```ts
{
  assumeTypes: true,
  ignoreClass: "fieldsOnly",
  ignoreImmediateMutation: true,
}
```

### `assumeTypes`

The rule take advantage of TypeScript's typing engine to check if mutation is taking place.
If you are not using TypeScript, type checking cannot be performed; hence this option exists.

This option will make the rule assume the type of the nodes it is checking are of type Array/Object.
However this may result in some false positives being picked up.

Disabling this option can result in false negatives, for example:

```js
// When this option is DISABLED (and type info is not available).
const x = [0, 1, 2];
x.push(3); // This will NOT be flagged.
// This is due to the fact that without a typing engine, we cannot tell that x is an array.
```

Note: This option will have no effect if the TypeScript typing engine is available (i.e. you are using TypeScript and have configured ESLint correctly).

### `ignoreImmediateMutation`

If true, immediate mutation of objects before they are assigned to a variable is allowed.
This allows for the use of array mutator methods to be chained to newly created arrays.

For example, an array can be immutably sorted like so:

```js
const original = ["foo", "bar", "baz"];
const sorted = [...original].sort((a, b) => a.localeCompare(b)); // This is OK with ignoreImmediateMutation.
```

### `ignoreClass`

Ignore mutations inside classes.

Classes already aren't functional so ignore mutations going on inside them.

### `ignorePattern`

Patterns will be matched against variable names.
See the [ignorePattern](./options/ignore-pattern.md) docs for more information.

### `ignoreAccessorPattern`

This option takes a match string or an array of match strings (not a RegExp pattern).

The match string allows you to specify dot separated `.` object paths and has support for "glob" `*` and "globstar" `**` matching.

For example:

```js
{
  // Ignore all reassigning to object properties that are prefixed with "mutable_".
  "ignoreAccessorPattern": "**.mutable_*"
}
```

```js
{
  // Ignore all shallow mutations made to object properties that are prefixed with "mutable_".
  "ignoreAccessorPattern": "**.mutable_*.*"
}
```

```js
{
  // Ignore all deep mutations made to object properties that are prefixed with "mutable_".
  "ignoreAccessorPattern": "**.mutable_*.*.**"
}
```

```js
{
  // Ignore all deep mutations and reassigning to object properties that are prefixed with "mutable_".
  "ignoreAccessorPattern": "**.mutable_*.**"
  // This is the same as `"ignoreAccessorPattern": ["**.mutable_*", "**.mutable_*.*.**"]`
}
```

#### Wildcards

The following wildcards can be used when specifying a pattern:

`**` - Match any depth (including zero). Can only be used as a full accessor.
`*` - When used as a full accessor, match the next accessor (there must be one). When used as part of an accessor, match any characters.
