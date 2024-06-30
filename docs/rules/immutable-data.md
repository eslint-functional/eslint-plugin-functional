<!-- markdownlint-disable -->
<!-- begin auto-generated rule header -->

# Enforce treating data as immutable (`functional/immutable-data`)

💼🚫 This rule is enabled in the following configs: ☑️ `lite`, `noMutations`, ✅ `recommended`, 🔒 `strict`. This rule is _disabled_ in the `disableTypeChecked` config.

💭 This rule requires [type information](https://typescript-eslint.io/linting/typed-linting).

<!-- end auto-generated rule header -->
<!-- markdownlint-restore -->
<!-- markdownlint-restore -->

This rule prohibits syntax that mutates existing objects and arrays via assignment to or deletion of their properties/elements.

## Rule Details

While requiring the `readonly` modifier forces declared types to be immutable,
it won't stop assignment into or modification of untyped objects or external types declared under different rules.

### ❌ Incorrect

<!-- eslint-skip -->

```js
/* eslint functional/immutable-data: "error" */

const obj = { foo: 1 };

obj.foo += 2; // <- Modifying an existing object/array is not allowed.
obj.bar = 1; // <- Modifying an existing object/array is not allowed.
delete obj.foo; // <- Modifying an existing object/array is not allowed.
Object.assign(obj, { bar: 2 }); // <- Modifying properties of existing object not allowed.
```

<!-- eslint-skip -->

```js
/* eslint functional/immutable-data: "error" */

const arr = [0, 1, 2];

arr[0] = 4; // <- Modifying an array is not allowed.
arr.length = 1; // <- Modifying an array is not allowed.
delete arr[1]; // <- Modifying an existing array is not allowed.
arr.push(3); // <- Modifying an array is not allowed.
```

### ✅ Correct

```js
/* eslint functional/immutable-data: "error" */

const obj = { foo: 1 };
const arr = [0, 1, 2];

const x = {
  ...obj,
  bar: [...arr, 3, 4],
};
```

## Options

This rule accepts an options object of the following type:

```ts
type Options = {
  ignoreClasses: boolean | "fieldsOnly";
  ignoreImmediateMutation: boolean;
  ignoreNonConstDeclarations:
    | boolean
    | {
        treatParametersAsConst: boolean;
      };
  ignoreIdentifierPattern?: string[] | string;
  ignoreAccessorPattern?: string[] | string;
  overrides?: Array<{
    match: Array<
      | {
          from: "file";
          path?: string;
          name?: string | string[];
          pattern?: RegExp | RegExp[];
          ignoreName?: string | string[];
          ignorePattern?: RegExp | RegExp[];
        }
      | {
          from: "lib";
          name?: string | string[];
          pattern?: RegExp | RegExp[];
          ignoreName?: string | string[];
          ignorePattern?: RegExp | RegExp[];
        }
      | {
          from: "package";
          package?: string;
          name?: string | string[];
          pattern?: RegExp | RegExp[];
          ignoreName?: string | string[];
          ignorePattern?: RegExp | RegExp[];
        }
    >;
    options: Omit<Options, "overrides">;
    inherit?: boolean;
    disable: boolean;
  }>;
};
```

### Default Options

```ts
type Options = {
  ignoreClasses: false;
  ignoreImmediateMutation: true;
  ignoreNonConstDeclarations: false;
};
```

### Preset Overrides

#### `lite`

```ts
const liteOptions = {
  ignoreClasses: "fieldsOnly",
};
```

### `ignoreImmediateMutation`

If true, immediate mutation of objects before they are assigned to a variable is allowed.
This allows for the use of array mutator methods to be chained to newly created arrays.

For example, an array can be immutably sorted like so:

```js
const original = ["foo", "bar", "baz"];
const sorted = [...original].sort((a, b) => a.localeCompare(b)); // This is OK with ignoreImmediateMutation.
```

### `ignoreNonConstDeclarations`

If true, this rule will ignore any mutations that happen on non-const variables.
This allow for more easily using mutable data by simply using the `let` keyword instead of `const`.

Note: If a value is referenced by both a `let` and a `const` variable, the `let`
reference can be modified while the `const` one can't. The may lead to value of
the `const` variable unexpectedly changing when the `let` one is modified elsewhere.

#### `treatParametersAsConst`

If true, parameters won't be ignored, while other non-const variables will be.

### `ignoreClasses`

Ignore mutations inside classes.

Classes already aren't functional so ignore mutations going on inside them.

### `ignoreIdentifierPattern`

This option takes a RegExp string or an array of RegExp strings.
It allows for the ability to ignore violations based on a variable's name.

### `ignoreAccessorPattern`

This option takes a match string or an array of match strings (not a RegExp pattern).

The match string allows you to specify dot separated `.` object paths and has support for "glob" `*` and "globstar" `**`
matching.

For example:

```jsonc
{
  // Ignore all reassigning to object properties that are prefixed with "mutable_".
  "ignoreAccessorPattern": "**.mutable_*",
}
```

```jsonc
{
  // Ignore all shallow mutations made to object properties that are prefixed with "mutable_".
  "ignoreAccessorPattern": "**.mutable_*.*",
}
```

```jsonc
{
  // Ignore all deep mutations made to object properties that are prefixed with "mutable_".
  "ignoreAccessorPattern": "**.mutable_*.*.**",
}
```

```jsonc
{
  // Ignore all deep mutations and reassigning to object properties that are prefixed with "mutable_".
  "ignoreAccessorPattern": "**.mutable_*.**",
  // This is the same as `"ignoreAccessorPattern": ["**.mutable_*", "**.mutable_*.*.**"]`
}
```

#### Wildcards

The following wildcards can be used when specifying a pattern:

`**` - Match any depth (including zero). Can only be used as a full accessor.\
`*` - When used as a full accessor, match the next accessor (there must be one). When used as part of an accessor, match
any characters.

### `overrides`

Allows for applying overrides to the options based on the root object's type.

Note: Only the first matching override will be used.

#### `overrides[n].specifiers`

A specifier, or an array of specifiers to match the function type against.

In the case of reference types, both the type and its generics will be recursively checked.
If any of them match, the specifier will be considered a match.

#### `overrides[n].options`

The options to use when a specifiers matches.

#### `overrides[n].inherit`

Inherit the root options? Default is `true`.

#### `overrides[n].disable`

If true, when a specifier matches, this rule will not be applied to the matching node.
