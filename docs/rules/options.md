## Options

### Using the `ignore-local` option

> If a tree falls in the woods, does it make a sound?
> If a pure function mutates some local data in order to produce an immutable return value, is that ok?

The quote above is from the [clojure docs](https://clojure.org/reference/transients). In general, it is more important to enforce immutability for state that is passed in and out of functions than for local state used for internal calculations within a function. For example in Redux, the state going in and out of reducers needs to be immutable while the reducer may be allowed to mutate local state in its calculations in order to achieve higher performance. This is what the `ignore-local` option enables. With this option enabled immutability will be enforced everywhere but in local state. Function parameters and return types are not considered local state so they will still be checked.

Note that using this option can lead to more imperative code in functions so use with care!

### Using the `ignore-class` option

Doesn't check for `readonly` in classes.

### Using the `ignore-interface` option

Doesn't check for `readonly` in interfaces.

### Using the `ignore-rest-parameters` option

Doesn't check for `ReadonlyArray` for function rest parameters.

### Using the `ignore-return-type` option

Doesn't check the return type of functions.

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

### Using the `ignore-new-array` option with `no-array-mutation`

This option allows for the use of array mutator methods to be chained to newly created arrays.

For example, an array can be immutably sorted like so:

```typescript
const original = ["foo", "bar", "baz"];
const sorted = original.slice().sort((a, b) => a.localeCompare(b)); // This is OK with ignore-new-array - note the use of the `slice` method which returns a copy of the original array.
```
