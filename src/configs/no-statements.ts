import { Config } from "../util/misc";

const config: Config = {
  rules: {
    "functional/no-expression-statement": "error",
    "functional/no-conditional-statement": "error",
    "functional/no-loop-statement": "error",
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      rules: {
        "functional/no-return-void": "error",
      },
    },
  ],
};

export default config;
