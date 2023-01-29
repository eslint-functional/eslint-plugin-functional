# Getting Started

## Installation

### JavaScript

```sh
# Install with npm
npm install -D eslint eslint-plugin-functional

# Install with yarn
yarn add -D eslint eslint-plugin-functional

# Install with pnpm
pnpm add -D eslint eslint-plugin-functional
```

### TypeScript

```sh
# Install with npm
npm install -D eslint @typescript-eslint/parser eslint-plugin-functional

# Install with yarn
yarn add -D eslint @typescript-eslint/parser eslint-plugin-functional

# Install with pnpm
pnpm add -D eslint @typescript-eslint/parser eslint-plugin-functional
```

## Usage

Add `functional` to the plugins section of your `.eslintrc` configuration file. Then configure the rules you want to use under the rules section.

```jsonc
{
  "plugins": ["functional"],
  "rules": {
    "functional/rule-name": "error"
  }
}
```

There are several rulesets provided by this plugin.
[See below](#rulesets) for what they are and what rules are included in each.
Enable rulesets via the "extends" property of your `.eslintrc` configuration file.

```jsonc
{
  // ...
  "extends": [
    "plugin:functional/external-vanilla-recommended",
    "plugin:functional/recommended",
    "plugin:functional/stylistic"
  ]
}
```

### With TypeScript

Add `@typescript-eslint/parser` to the "parser" filed in your `.eslintrc` configuration file.
To use type information, you will need to specify a path to your `tsconfig.json` file in the "project" property of "parserOptions".

```jsonc
{
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": "./tsconfig.json"
  }
}
```

See [@typescript-eslint/parser's README.md](https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/parser#readme) for more information on the available parser options.

### Example Config

```jsonc
{
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": "tsconfig.json"
  },
  "env": {
    "es6": true
  },
  "plugins": [
    "@typescript-eslint",
    "functional"
  ],
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:functional/external-typescript-recommended",
    "plugin:functional/recommended",
    "plugin:functional/stylistic"
  ]
}
```
