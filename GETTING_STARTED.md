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
npm install -D eslint typescript-eslint eslint-plugin-functional

# Install with yarn
yarn add -D eslint typescript-eslint eslint-plugin-functional

# Install with pnpm
pnpm add -D eslint typescript-eslint eslint-plugin-functional
```

## Usage

### With TypeScript

In your `eslint.config.js` file, import `typescript-eslint` and `eslint-plugin-functional` and configure them as you wish.

```js
// eslint.config.js
import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import functional from "eslint-plugin-functional";
import tseslint from "typescript-eslint";

export default defineConfig(
  eslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  functional.configs.externalTypeScriptRecommended,
  functional.configs.recommended,
  functional.configs.stylistic,
  // any other plugin configs here
  {
    rules: {
      // any rule configs here
    },
  },
  {
    // enable types for type-aware linting
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
  },
  {
    // disable type-aware linting on JS files
    files: ['**/*.js'],
    extends: [
      tseslint.configs.disableTypeChecked,
      functional.configs.disableTypeChecked,
    ],
  },
);
```

### Without TypeScript

In your `eslint.config.js` file, import `eslint-plugin-functional` and configure it as you wish.

If you're not using TypeScript, be sure to include the `disableTypeChecked` config after the other configs to
disable rules that require TypeScript.

```js
// eslint.config.js
import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import functional from "eslint-plugin-functional";

export default defineConfig(
  eslint.configs.recommended,
  functional.configs.externalVanillaRecommended,
  functional.configs.recommended,
  functional.configs.stylistic,
  functional.configs.disableTypeChecked,
  // any other plugin configs here
  {
    rules: {
      // any rule configs here
    },
  },
);
```
