### readonly-keyword

This rule enforces use of the `readonly` modifier. The `readonly` modifier can appear on property signatures in interfaces, property declarations in classes, and index signatures.

Below is some information about the `readonly` modifier and the benefits of using it:

You might think that using `const` would eliminate mutation from your TypeScript code. **Wrong.** Turns out that there's a pretty big loophole in `const`.

```typescript
interface Point {
  x: number;
  y: number;
}
const point: Point = { x: 23, y: 44 };
point.x = 99; // This is legal
```

This is why the `readonly` modifier exists. It prevents you from assigning a value to the result of a member expression.

```typescript
interface Point {
  readonly x: number;
  readonly y: number;
}
const point: Point = { x: 23, y: 44 };
point.x = 99; // <- No object mutation allowed.
```

This is just as effective as using Object.freeze() to prevent mutations in your Redux reducers. However the `readonly` modifier has **no run-time cost**, and is enforced at **compile time**. A good alternative to object mutation is to use the ES2016 object spread [syntax](https://github.com/Microsoft/TypeScript/wiki/What's-new-in-TypeScript#object-spread-and-rest) that was added in typescript 2.1:

```typescript
interface Point {
  readonly x: number;
  readonly y: number;
}
const point: Point = { x: 23, y: 44 };
const transformedPoint = { ...point, x: 99 };
```

Note that you can also use object spread when destructuring to [delete keys](http://stackoverflow.com/questions/35342355/remove-data-from-nested-objects-without-mutating/35676025#35676025) in an object:

```typescript
let { [action.id]: deletedItem, ...rest } = state;
```

The `readonly` modifier also works on indexers:

```typescript
const foo: { readonly [key: string]: number } = { a: 1, b: 2 };
foo["a"] = 3; // Error: Index signature only permits reading
```

#### Has Fixer

Yes

#### Options

- [ignore-local](#using-the-ignore-local-option)
- [ignore-class](#using-the-ignore-class-option)
- [ignore-interface](#using-the-ignore-interface-option)
- [ignore-prefix](#using-the-ignore-prefix-option)
- [ignore-suffix](#using-the-ignore-suffix-option)
- [ignore-pattern](#using-the-ignore-pattern-option)

#### Example config

```javascript
"readonly-keyword": true
```

```javascript
"readonly-keyword": [true, "ignore-local"]
```

```javascript
"readonly-keyword": [true, "ignore-local", {"ignore-prefix": "mutable"}]
```
