// import * as ESLint from "eslint";
// import { filename } from "./configs";

// type RuleTesterTests = {
//   valid?: Array<string | ESLint.RuleTester.ValidTestCase>;
//   invalid?: ESLint.RuleTester.InvalidTestCase[];
// };

// export class RuleTester extends ESLint.RuleTester {
//   run(
//     name: string,
//     rule: ESLint.Rule.RuleModule,
//     tests: RuleTesterTests
//   ): void {
//     super.run(name, rule, addFilename(filename, tests));
//   }
// }

// function addFilename(
//   filename: string,
//   tests: RuleTesterTests
// ): RuleTesterTests {
//   const { valid, invalid } = tests;
//   return {
//     invalid: invalid.map(test => ({ ...test, filename })),
//     valid: valid.map(test =>
//       typeof test === "string"
//         ? { code: test, filename }
//         : { ...test, filename }
//     )
//   };
// }
