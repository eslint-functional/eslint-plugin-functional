import dedent from "dedent";

import { type rule } from "#/rules/no-throw-statements";
import { type OptionsOf, type ValidTestCaseSet } from "#/tests/helpers/util";

const tests: Array<ValidTestCaseSet<OptionsOf<typeof rule>>> = [
  {
    code: dedent`
      const foo = Promise.reject();
      foo.catch(() => {
        throw new Error();
      });
    `,
    optionsSet: [
      [
        {
          allowToRejectPromises: true,
        },
      ],
    ],
  },
  {
    code: dedent`
        const foo = Promise.reject();
        foo.then(
          () => {},
          () => {
            throw new Error();
          }
      );
    `,
    optionsSet: [
      [
        {
          allowToRejectPromises: true,
        },
      ],
    ],
  },
];

export default tests;
