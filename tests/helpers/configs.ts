import path from "node:path";

import type { Linter } from "@typescript-eslint/utils/ts-eslint";

export const filename = path.join(__dirname, "file.ts");

// eslint-disable-next-line node/no-missing-require -- See https://github.com/mysticatea/eslint-plugin-node/issues/255
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

  esLatest: {
    parser: babelParser,
    parserOptions: {
      ecmaVersion: "latest",
      requireConfigFile: false,
      babelOptions: {
        babelrc: false,
        configFile: false,
      },
    },
  } as Linter.Config,

  es2022: {
    parser: babelParser,
    parserOptions: {
      ecmaVersion: 2022,
      requireConfigFile: false,
      babelOptions: {
        babelrc: false,
        configFile: false,
      },
    },
  } as Linter.Config,

  es2021: {
    parser: babelParser,
    parserOptions: {
      ecmaVersion: 2021,
      requireConfigFile: false,
      babelOptions: {
        babelrc: false,
        configFile: false,
      },
    },
  } as Linter.Config,

  es2020: {
    parser: babelParser,
    parserOptions: {
      ecmaVersion: 2020,
      requireConfigFile: false,
      babelOptions: {
        babelrc: false,
        configFile: false,
      },
    },
  } as Linter.Config,

  es2019: {
    parser: babelParser,
    parserOptions: {
      ecmaVersion: 2019,
      requireConfigFile: false,
      babelOptions: {
        babelrc: false,
        configFile: false,
      },
    },
  } as Linter.Config,

  es2018: {
    parser: babelParser,
    parserOptions: {
      ecmaVersion: 2018,
      requireConfigFile: false,
      babelOptions: {
        babelrc: false,
        configFile: false,
      },
    },
  } as Linter.Config,

  es2017: {
    parser: babelParser,
    parserOptions: {
      ecmaVersion: 2017,
      requireConfigFile: false,
      babelOptions: {
        babelrc: false,
        configFile: false,
      },
    },
  } as Linter.Config,

  es2016: {
    parser: babelParser,
    parserOptions: {
      ecmaVersion: 2016,
      requireConfigFile: false,
      babelOptions: {
        babelrc: false,
        configFile: false,
      },
    },
  } as Linter.Config,

  es2015: {
    parser: babelParser,
    parserOptions: {
      ecmaVersion: 2015,
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
