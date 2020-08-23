import { Config } from "../util/misc";

const config: Config = {
  rules: {
    "functional/no-let": "error",
    "functional/immutable-data": "error",
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      rules: {
        "functional/no-method-signature": "warn",
        "functional/prefer-readonly-type": "error",
      },
    },
  ],
};

export default config;
