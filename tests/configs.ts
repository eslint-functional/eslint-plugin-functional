import { Linter } from "eslint";

export const typescript: Linter.Config = {
  parser: require.resolve("@typescript-eslint/parser"),
  parserOptions: {
    sourceType: "module"
  }
};

export const es9: Linter.Config = {
  parser: require.resolve("babel-eslint"),
  parserOptions: {
    ecmaVersion: 9
  }
};

export const es8: Linter.Config = {
  parser: require.resolve("babel-eslint"),
  parserOptions: {
    ecmaVersion: 8
  }
};

export const es7: Linter.Config = {
  parser: require.resolve("babel-eslint"),
  parserOptions: {
    ecmaVersion: 7
  }
};

export const es6: Linter.Config = {
  parser: require.resolve("babel-eslint"),
  parserOptions: {
    ecmaVersion: 6
  }
};

export const es5: Linter.Config = {
  parser: require.resolve("espree"),
  parserOptions: {
    ecmaVersion: 5
  }
};

export const es3: Linter.Config = {
  parser: require.resolve("espree"),
  parserOptions: {
    ecmaVersion: 3
  }
};
