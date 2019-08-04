# Using the `ignorePattern` option

This option takes a RegExp string or an array of RegExp strings.

Some languages are immutable by default but allows you to explicitly declare mutable variables. For example in [reason](https://facebook.github.io/reason/) you can declare mutable record fields like this:

```reason
type person = {
  name: string,
  mutable age: int
};
```

Typescript is not immutable by default but it can be if you use this package. So in order to create an escape hatch similar to how it is done in reason the `ignorePattern` option can be used. For example if you configure it to allow variables with names that has the prefix "mutable" you can emulate the above example in typescript like this:

```typescript
type person = {
  readonly name: string;
  mutableAge: number; // This is OK with ignorePattern = "^mutable"
};
```

Yes, variable names like `mutableAge` are ugly, but then again mutation is an ugly business :-).
