# Using the `ignoreAccessorPattern` option

This option takes a match string or an array of match strings (not a RegExp pattern).

The match string allows you to specify dot seperated `.` object paths and has support for "glob" `*` and "globstar" `**` matching.

For example:

```js
{
  // Ignore all mutations directly on top-level objects that are prefixed with "mutable_".
  "ignorePattern": "mutable_*"
}
```

```js
{
  // Ignore all mutations directly on all objects, and any of their deeply nested properties, where that object is prefixed with "mutable_".
  "ignorePattern": "**.mutable_*.**"
}
```

## Wildcards

The following wildcards can be used when specifing a pattern:

`**` - Match any depth (including zero). Can only be used as a full accessor.
`*` - When used as a full accessor, match the next accessor. When used as part of an accessor, match any characters.
