import type { Linter } from "eslint";
import path from "path";

export const filename = path.join(__dirname, "file.ts");

const typescriptParser = "@typescript-eslint/parser";
const babelParser = "babel-eslint";
const espreeParser = "espree";

export const typescript: Linter.Config = {
  parser: require.resolve(typescriptParser),
  parserOptions: {
    sourceType: "module",
    project: path.join(__dirname, "./tsconfig.json"),
  },
};

export const es9: Linter.Config = {
  parser: require.resolve(babelParser),
  parserOptions: {
    ecmaVersion: 9,
  },
};

export const es8: Linter.Config = {
  parser: require.resolve(babelParser),
  parserOptions: {
    ecmaVersion: 8,
  },
};

export const es7: Linter.Config = {
  parser: require.resolve(babelParser),
  parserOptions: {
    ecmaVersion: 7,
  },
};

export const es6: Linter.Config = {
  parser: require.resolve(babelParser),
  parserOptions: {
    ecmaVersion: 6,
  },
};

export const es5: Linter.Config = {
  parser: require.resolve(espreeParser),
  parserOptions: {
    ecmaVersion: 5,
  },
};

export const es3: Linter.Config = {
  parser: require.resolve(espreeParser),
  parserOptions: {
    ecmaVersion: 3,
  },
};
