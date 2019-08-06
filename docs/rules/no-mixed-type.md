# Restrict types so that only members of the same kind of are allowed in them (no-mixed-type)

This rule enforces that an aliased type literal or an interface only has one type of members, eg. only data properties or only functions.

## Rule Details

Mixing functions and data properties in the same type is a sign of object-orientation style.

## Limitations

This rule will only check alias type literal declarations and interface declarations. Advanced types will not be checked.
For example intersection types will not be checked.

```ts
// Interface declaration - Will be checked.
interface IFoo {
  prop1: string;
}

// Alias type literal declaration - Will be checked.
type Foo = {
  prop1: string;
};

// Alias type intersection declaration (Advanced type) - Will NOT be checked.
type Baz = Foo & {
  prop2: () => string;
};
```

## Options

The rule accepts an options object with the following properties:

```ts
type Options = {
  checkInterfaces: boolean;
  checkTypeLiterals: boolean;
};

const defaults = {
  checkInterfaces: true,
  checkTypeLiterals: true
};
```

### checkInterfaces

If true, interface declarations will be checked.

### checkTypeLiterals

If true, aliased type literal declarations will be checked.
