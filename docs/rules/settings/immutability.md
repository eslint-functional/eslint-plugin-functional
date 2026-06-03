# Using the `immutability` setting

We are using the
[is-immutable-type](https://www.npmjs.com/package/is-immutable-type) library to
determine the immutability of types. This library can be configure for all rules
at once using a shared setting.

## Overrides

For details see [the overrides
section](https://github.com/RebeccaStevens/is-immutable-type#overrides) of
[is-immutable-type](https://www.npmjs.com/package/is-immutable-type).

### Resolution order

When looking up an override for a type, the first matching entry wins. User
overrides are placed before the built-in defaults, so a user-defined override
for a type that also has a default (e.g. `Date`) takes precedence. Set
`keepDefault: false` to drop the built-in defaults entirely.

### Example of configuring immutability overrides

In this example, we are configuring
[is-immutable-type](https://www.npmjs.com/package/is-immutable-type) to treat
any readonly array (regardless of the syntax used) as immutable in the case
where it was found to be deeply readonly. If it was only found to be shallowly
readonly, then no override will be applied.

```jsonc
// .eslintrc.json
{
  // ...
  "settings": {
    "immutability": {
      "overrides": [
        {
          "type": {
            "from": "lib",
            "name": "ReadonlyArray",
          },
          "to": "Immutable",
          "from": "ReadonlyDeep",
        },
      ],
    },
  },
  "rules": {
    // ...
  },
}
```
