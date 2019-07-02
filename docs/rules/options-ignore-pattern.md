### Using the `ignore-prefix` option

Some languages are immutable by default but allows you to explicitly declare mutable variables. For example in [reason](https://facebook.github.io/reason/) you can declare mutable record fields like this:

```reason
type person = {
  name: string,
  mutable age: int
};
```

Typescript is not immutable by default but it can be if you use this package. So in order to create an escape hatch similar to how it is done in reason the `ignore-prefix` option can be used. For example if you configure it to ignore variables with names that has the prefix "mutable" you can emulate the above example in typescript like this:

```typescript
type person = {
  readonly name: string;
  mutableAge: number; // This is OK with ignore-prefix = "mutable"
};
```

Yes, variable names like `mutableAge` are ugly, but then again mutation is an ugly business :-).

### Using the `ignore-suffix` option

Like ignore-prefix but with suffix matching instead of prefix matching.

### Using the `ignore-pattern` option

Like ignore-prefix and ignore-suffix but with more control.

This option allows you to specify dot seperated paths what should be ignored.

For example, the following config would ignore all object mutations for all properties that start with "mutable".

```json
{
  "no-object-mutation": [true, { "ignore-pattern": "**.mutable*" }]
}
```

The following wildcards can be used when specifing a pattern:

- `**` - Match any depth (including zero). Can only be used as a full accessor.
- `*` - When used as a full accessor, match the next accessor. When used as part of an accessor, match any characters.

### Using the `ignore-prefix` option with `no-expression-statement`

Expression statements typically cause side effects, however not all side effects are undesirable. One example of a helpful side effect is logging. To not get warning of every log statement, we can configure the linter to ignore well known expression statement prefixes.

One such prefix could be `console.`, which would cover both these cases:

```typescript
const doSomething(arg:string) => {
  if (arg) {
    console.log("Argument is", arg);
  } else {
    console.warn("Argument is empty!");
  }
  return `Hello ${arg}`;
}
```
