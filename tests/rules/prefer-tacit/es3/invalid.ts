import { type rule } from "~/rules/prefer-tacit";
import {
  type InvalidTestCaseSet,
  type MessagesOf,
  type OptionsOf,
} from "~/tests/helpers/util";

const tests: Array<
  InvalidTestCaseSet<MessagesOf<typeof rule>, OptionsOf<typeof rule>>
> = [
  // {
  //   code: "var foo = function(x) { f(x); }",
  //   optionsSet: [[{ assumeTypes: true }]],
  //   errors: [
  //     {
  //       messageId: "generic",
  //       type: "ArrowFunctionExpression",
  //       line: 1,
  //       column: 13,
  //       suggestions: [
  //         {
  //           output: dedent`
  //             var foo = f;
  //           `,
  //         },
  //       ],
  //     },
  //   ],
  // },
];

export default tests;
