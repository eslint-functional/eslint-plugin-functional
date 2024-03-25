import { type rule } from "#eslint-plugin-functional/rules/no-mixed-types";
import {
  type InvalidTestCaseSet,
  type MessagesOf,
  type OptionsOf,
} from "#eslint-plugin-functional/tests/helpers/util";

const tests: Array<
  InvalidTestCaseSet<MessagesOf<typeof rule>, OptionsOf<typeof rule>>
> = [
  // // Mixing properties and methods (MethodSignature) should produce failures.
  // {
  //   code: dedent`
  //     type Foo = {
  //       bar: string;
  //       zoo(): number;
  //     };
  //   `,
  //   optionsSet: [[], [{ checkInterfaces: false }]],
  //   errors: [
  //     {
  //       messageId: "generic",
  //       type: AST_NODE_TYPES.TSTypeAliasDeclaration,
  //       line: 1,
  //       column: 1,
  //     },
  //   ],
  // },
  // {
  //   code: dedent`
  //     type Foo = Readonly<{
  //       bar: string;
  //       zoo(): number;
  //     }>;
  //   `,
  //   optionsSet: [[], [{ checkInterfaces: false }]],
  //   errors: [
  //     {
  //       messageId: "generic",
  //       type: AST_NODE_TYPES.TSTypeAliasDeclaration,
  //       line: 1,
  //       column: 1,
  //     },
  //   ],
  // },
  // {
  //   code: dedent`
  //     interface Foo {
  //       bar: string;
  //       zoo(): number;
  //     }
  //   `,
  //   optionsSet: [[], [{ checkTypeLiterals: false }]],
  //   errors: [
  //     {
  //       messageId: "generic",
  //       type: AST_NODE_TYPES.TSInterfaceDeclaration,
  //       line: 1,
  //       column: 1,
  //     },
  //   ],
  // },
  // // Mixing properties and functions (PropertySignature) should produce failures.
  // {
  //   code: dedent`
  //     type Foo = {
  //       bar: string;
  //       zoo: () => number;
  //     };
  //   `,
  //   optionsSet: [[], [{ checkInterfaces: false }]],
  //   errors: [
  //     {
  //       messageId: "generic",
  //       type: AST_NODE_TYPES.TSTypeAliasDeclaration,
  //       line: 1,
  //       column: 1,
  //     },
  //   ],
  // },
  // {
  //   code: dedent`
  //     type Foo = Readonly<{
  //       bar: string;
  //       zoo: () => number;
  //     }>;
  //   `,
  //   optionsSet: [[], [{ checkInterfaces: false }]],
  //   errors: [
  //     {
  //       messageId: "generic",
  //       type: AST_NODE_TYPES.TSTypeAliasDeclaration,
  //       line: 1,
  //       column: 1,
  //     },
  //   ],
  // },
  // {
  //   code: dedent`
  //     interface Foo {
  //       bar: string;
  //       zoo: () => number;
  //     }
  //   `,
  //   optionsSet: [[], [{ checkTypeLiterals: false }]],
  //   errors: [
  //     {
  //       messageId: "generic",
  //       type: AST_NODE_TYPES.TSInterfaceDeclaration,
  //       line: 1,
  //       column: 1,
  //     },
  //   ],
  // },
];

export default tests;
