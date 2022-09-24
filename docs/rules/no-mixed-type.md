# Restrict types so that only members of the same kind of are allowed in them (no-mixed-type)

This rule enforces that an aliased type literal or an interface only has one type of members, eg. only data properties or only functions.

## Rule Details

Mixing functions and data properties in the same type is a sign of object-orientation style.

### ❌ Incorrect

<!-- eslint-skip -->

```ts
/* eslint functional/no-mixed-type: "error" */

type Foo = {
  prop1: string;
  prop2: () => string;
};
```

### ✅ Correct

```ts
/* eslint functional/no-mixed-type: "error" */

type Foo = {
  prop1: string;
  prop2: number;
};
```

```ts
/* eslint functional/no-mixed-type: "error" */

type Foo = {
  prop1: () => string;
  prop2: () => () => number;
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
}
```

### Default Options

```ts
const defaults = {
  checkInterfaces: true,
  checkTypeLiterals: true
}
```

### checkInterfaces

If true, interface declarations will be checked.

### checkTypeLiterals

If true, aliased type literal declarations will be checked.
