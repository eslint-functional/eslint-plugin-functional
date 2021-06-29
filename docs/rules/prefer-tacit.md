# Tacit / Point-Free (prefer-tacit)

This rule enforces using functions directly if they can be without wrapping them.

## Rule Details

Generally there's no reason to wrap a function with a callback wrapper if it's directly called anyway.
Doing so creates extra inline lambdas that slow the runtime down.

Examples of **incorrect** code for this rule:

```ts
/* eslint functional/prefer-tacit: "error" */

function f(x) {
  // ...
}

const foo = x => f(x);
```

Examples of **correct** code for this rule:

```ts
/* eslint functional/prefer-tacit: "error" */

function f(x) {
  // ...
}

const foo = f;
```

## Options

This rule accepts an options object of the following type:

```ts
{
  assumeTypes:
    | false
    | {
        allowFixer: boolean;
      }
  ignorePattern?: string | Array<string>;
}
```

The default options:

```ts
{
  assumeTypes: false,
};
```

### `assumeTypes`

The rule take advantage of TypeScript's typing engine to check if callback wrapper is in fact safe to remove.

This option will make the rule assume that the function only accepts the arguments given to it in the wrapper.
However this may result in some false positives being picked up.

```js
const foo = x => f(x);    // If `f` only accepts one parameter then this is violation of the rule.
const bar = foo(1, 2, 3); // But if `f` accepts more than one parameter then it isn't.
```

Note: Enabling this option is the only way to get this rule to report violations in an environment without TypeScript's typing engine available (e.g. In Vanilla JS).

### `assumeTypes.allowFixer`

When set types will be assumed.

This option states whether the auto fixer should be enabled for violations that are found when assuming types (violations found without assuming types will ignore this option).
Because when assuming types, false positives may be found, it's recommended to set this option to `false`.

### `ignorePattern`

See the [ignorePattern](./options/ignore-pattern.md) docs.
