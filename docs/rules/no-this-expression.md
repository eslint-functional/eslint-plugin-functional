# Disallow this access (no-this-expression)

This rule is companion rule to the [no-class](./no-class.md) rule.
See the its docs for more info.

Examples of **incorrect** code for this rule:

<!-- eslint-skip -->

```js
/* eslint functional/no-this-expression: "error" */

const foo = this.value + 17;
```

Examples of **correct** code for this rule:

```js
/* eslint functional/no-this-expression: "error" */

const foo = object.value + 17;
```

## Options

The rule does not accept any options.
