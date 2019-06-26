export const typescript = {
  parser: require.resolve("@typescript-eslint/parser"),
  parserOptions: {
    sourceType: "module"
  }
};

export const es10 = {
  parser: require.resolve("babel-eslint"),
  parserOptions: {
    ecmaVersion: 10
  }
};

export const es9 = {
  parser: require.resolve("babel-eslint"),
  parserOptions: {
    ecmaVersion: 9
  }
};

export const es8 = {
  parser: require.resolve("babel-eslint"),
  parserOptions: {
    ecmaVersion: 8
  }
};

export const es7 = {
  parser: require.resolve("babel-eslint"),
  parserOptions: {
    ecmaVersion: 7
  }
};

export const es6 = {
  parser: require.resolve("babel-eslint"),
  parserOptions: {
    ecmaVersion: 6
  }
};

export const es5 = {
  parser: require.resolve("espree"),
  parserOptions: {
    ecmaVersion: 5
  }
};

export const es3 = {
  parser: require.resolve("espree"),
  parserOptions: {
    ecmaVersion: 3
  }
};
