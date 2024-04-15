import path from "node:path";

import { type RuleTesterConfig } from "@typescript-eslint/rule-tester";

const fixturePath = path.join(process.cwd(), "tests/fixture");
export const filename = path.join(fixturePath, "file.ts");

const typescriptParser = require.resolve("@typescript-eslint/parser");
const babelParser = require.resolve("@babel/eslint-parser");
const espreeParser = require.resolve("espree");

export const configs = {
  typescript: {
    parser: typescriptParser,
    parserOptions: {
      sourceType: "module",
      tsconfigRootDir: fixturePath,
      project: "tsconfig.json",
    },
    dependencyConstraints: {
      typescript: "4.7.4",
    },
  } satisfies RuleTesterConfig,

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
  } satisfies RuleTesterConfig,

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
  } satisfies RuleTesterConfig,

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
  } satisfies RuleTesterConfig,

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
  } satisfies RuleTesterConfig,

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
  } satisfies RuleTesterConfig,

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
  } satisfies RuleTesterConfig,

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
  } satisfies RuleTesterConfig,

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
  } satisfies RuleTesterConfig,

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
  } satisfies RuleTesterConfig,

  es5: {
    parser: espreeParser,
    parserOptions: {
      ecmaVersion: 5,
    },
  } satisfies RuleTesterConfig,

  es3: {
    parser: espreeParser,
    parserOptions: {
      ecmaVersion: 3,
    },
  } satisfies RuleTesterConfig,
};
