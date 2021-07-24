import type { InvalidTestCase } from "~/tests/helpers/util";

const tests: ReadonlyArray<InvalidTestCase> = [
  {
    code: `try {} catch (e) {}`,
    optionsSet: [[]],
    errors: [
      {
        messageId: "catch",
        type: "TryStatement",
        line: 1,
        column: 1,
      },
    ],
  },
  {
    code: `try {} catch (e) {} finally {}`,
    optionsSet: [[]],
    errors: [
      {
        messageId: "catch",
        type: "TryStatement",
        line: 1,
        column: 1,
      },
    ],
  },
  {
    code: `try {} catch (e) {} finally {}`,
    optionsSet: [[{ allowCatch: true }]],
    errors: [
      {
        messageId: "finally",
        type: "TryStatement",
        line: 1,
        column: 1,
      },
    ],
  },
  {
    code: `try {} catch (e) {} finally {}`,
    optionsSet: [[{ allowFinally: true }]],
    errors: [
      {
        messageId: "catch",
        type: "TryStatement",
        line: 1,
        column: 1,
      },
    ],
  },
  {
    code: `try {} finally {}`,
    optionsSet: [[]],
    errors: [
      {
        messageId: "finally",
        type: "TryStatement",
        line: 1,
        column: 1,
      },
    ],
  },
];

export default tests;
