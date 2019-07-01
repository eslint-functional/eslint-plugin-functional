### no-delete

The delete operator allows for mutating objects by deleting keys. This rule disallows any delete expressions.

```typescript
delete object.property; // Unexpected delete, objects should be considered immutable.
```

As an alternative the spread operator can be used to delete a key in an object (as noted [here](https://stackoverflow.com/a/35676025/2761797)):

```typescript
const { [action.id]: deletedItem, ...rest } = state;
```
