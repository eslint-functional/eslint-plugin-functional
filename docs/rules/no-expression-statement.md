### no-expression-statement

When you call a function and don’t use it’s return value, chances are high that it is being called for its side effect. e.g.

```typescript
array.push(1);
alert("Hello world!");
```

This rule checks that the value of an expression is assigned to a variable and thus helps promote side-effect free (pure) functions.

#### Options

- [ignore-prefix](#using-the-ignore-prefix-option-with-no-expression-statement)

#### Example config

```javascript
"no-expression-statement": true
```

```javascript
"no-expression-statement": [true, {"ignore-prefix": "console."}]
```

```javascript
"no-expression-statement": [true, {"ignore-prefix": ["console.log", "console.error"]}]
```
