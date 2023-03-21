import path from "node:path";

import type { Linter } from "eslint";

export const filename = path.join(__dirname, "file.ts");

const typescriptParser = require.resolve("@typescript-eslint/parser");
const babelParser = require.resolve("@babel/eslint-parser");
const espreeParser = require.resolve("espree");

export const configs = {
  typescript: {
    parser: typescriptParser,
    parserOptions: {
      sourceType: "module",
      project: path.join(__dirname, "./test-tsconfig.json"),
    },
  } as Linter.Config,

  es11: {
    parser: babelParser,
    parserOptions: {
      ecmaVersion: 11,
      requireConfigFile: false,
      babelOptions: {
        babelrc: false,
        configFile: false,
      },
    },
  } as Linter.Config,

  es10: {
    parser: babelParser,
    parserOptions: {
      ecmaVersion: 10,
      requireConfigFile: false,
      babelOptions: {
        babelrc: false,
        configFile: false,
      },
    },
  } as Linter.Config,

  es9: {
    parser: babelParser,
    parserOptions: {
      ecmaVersion: 9,
      requireConfigFile: false,
      babelOptions: {
        babelrc: false,
        configFile: false,
      },
    },
  } as Linter.Config,

  es8: {
    parser: babelParser,
    parserOptions: {
      ecmaVersion: 8,
      requireConfigFile: false,
      babelOptions: {
        babelrc: false,
        configFile: false,
      },
    },
  } as Linter.Config,

  es7: {
    parser: babelParser,
    parserOptions: {
      ecmaVersion: 7,
      requireConfigFile: false,
      babelOptions: {
        babelrc: false,
        configFile: false,
      },
    },
  } as Linter.Config,

  es6: {
    parser: babelParser,
    parserOptions: {
      ecmaVersion: 6,
      requireConfigFile: false,
      babelOptions: {
        babelrc: false,
        configFile: false,
      },
    },
  } as Linter.Config,

  es5: {
    parser: espreeParser,
    parserOptions: {
      ecmaVersion: 5,
    },
  } as Linter.Config,

  es3: {
    parser: espreeParser,
    parserOptions: {
      ecmaVersion: 3,
    },
  } as Linter.Config,
};
