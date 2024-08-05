import path from "node:path";

// @ts-expect-error - Untyped.
import babelParser from "@babel/eslint-parser";
import typescriptParser from "@typescript-eslint/parser";
import type { RuleTesterConfig } from "@typescript-eslint/rule-tester";
import espreeParser from "espree";

const fixturePath = path.join(process.cwd(), "tests/fixture");
export const filename: string = path.join(fixturePath, "file.ts");

export const configs = {
  typescript: {
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        sourceType: "module",
        tsconfigRootDir: fixturePath,
        projectService: true,
      },
    },
    dependencyConstraints: {
      typescript: "4.7.4",
    },
  } satisfies RuleTesterConfig as RuleTesterConfig,

  esLatest: {
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        ecmaVersion: "latest",
        requireConfigFile: false,
        babelOptions: {
          babelrc: false,
          configFile: false,
        },
      },
    },
  } satisfies RuleTesterConfig as RuleTesterConfig,

  es2022: {
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        ecmaVersion: 2022,
        requireConfigFile: false,
        babelOptions: {
          babelrc: false,
          configFile: false,
        },
      },
    },
  } satisfies RuleTesterConfig as RuleTesterConfig,

  es2021: {
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        ecmaVersion: 2021,
        requireConfigFile: false,
        babelOptions: {
          babelrc: false,
          configFile: false,
        },
      },
    },
  } satisfies RuleTesterConfig as RuleTesterConfig,

  es2020: {
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        ecmaVersion: 2020,
        requireConfigFile: false,
        babelOptions: {
          babelrc: false,
          configFile: false,
        },
      },
    },
  } satisfies RuleTesterConfig as RuleTesterConfig,

  es2019: {
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        ecmaVersion: 2019,
        requireConfigFile: false,
        babelOptions: {
          babelrc: false,
          configFile: false,
        },
      },
    },
  } satisfies RuleTesterConfig as RuleTesterConfig,

  es2018: {
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        ecmaVersion: 2018,
        requireConfigFile: false,
        babelOptions: {
          babelrc: false,
          configFile: false,
        },
      },
    },
  } satisfies RuleTesterConfig as RuleTesterConfig,

  es2017: {
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        ecmaVersion: 2017,
        requireConfigFile: false,
        babelOptions: {
          babelrc: false,
          configFile: false,
        },
      },
    },
  } satisfies RuleTesterConfig as RuleTesterConfig,

  es2016: {
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        ecmaVersion: 2016,
        requireConfigFile: false,
        babelOptions: {
          babelrc: false,
          configFile: false,
        },
      },
    },
  } satisfies RuleTesterConfig as RuleTesterConfig,

  es2015: {
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        ecmaVersion: 2015,
        requireConfigFile: false,
        babelOptions: {
          babelrc: false,
          configFile: false,
        },
      },
    },
  } satisfies RuleTesterConfig as RuleTesterConfig,

  es5: {
    languageOptions: {
      parser: espreeParser,
      parserOptions: {
        ecmaVersion: 5,
      },
    },
  } satisfies RuleTesterConfig as RuleTesterConfig,

  es3: {
    languageOptions: {
      parser: espreeParser,
      parserOptions: {
        ecmaVersion: 3,
      },
    },
  } satisfies RuleTesterConfig as RuleTesterConfig,
};
