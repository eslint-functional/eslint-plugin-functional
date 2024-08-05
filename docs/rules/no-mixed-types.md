<!-- markdownlint-disable -->
<!-- begin auto-generated rule header -->

# Restrict types so that only members of the same kind are allowed in them (`functional/no-mixed-types`)

💼🚫 This rule is enabled in the following configs: ☑️ `lite`, `noOtherParadigms`, ✅ `recommended`, 🔒 `strict`. This rule is _disabled_ in the `disableTypeChecked` config.

💭 This rule requires [type information](https://typescript-eslint.io/linting/typed-linting).

<!-- end auto-generated rule header -->
<!-- markdownlint-restore -->
<!-- markdownlint-restore -->

This rule enforces that an aliased type literal or an interface only has one type of members, eg. only data properties
or only functions.

## Rule Details

Mixing functions and data properties in the same type is a sign of object-orientation style.

### ❌ Incorrect

<!-- eslint-skip -->

```ts
/* eslint functional/no-mixed-types: "error" */

type Foo = {
  prop1: string;
  prop2: () => string;
};
```

### ✅ Correct

```ts
/* eslint functional/no-mixed-types: "error" */

type Foo = {
  prop1: string;
  prop2: number;
};
```

<!-- eslint-disable functional/prefer-property-signatures -->

```ts
/* eslint functional/no-mixed-types: "error" */

type Foo = {
  prop1: () => string;
  prop2(): number;
};
```

## Limitations

This rule will only check alias type literal declarations and interface declarations. Advanced types will not be checked.
For example union and intersection types will not be checked.

## Options

This rule accepts an options object of the following type:

```ts
type Options = {
  checkInterfaces: boolean;
  checkTypeLiterals: boolean;
};
```

### Default Options

```ts
const defaults = {
  checkInterfaces: true,
  checkTypeLiterals: true,
};
```

### checkInterfaces

If true, interface declarations will be checked.

### checkTypeLiterals

If true, aliased type literal declarations will be checked.
