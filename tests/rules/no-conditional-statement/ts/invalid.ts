import type { rule } from "~/rules/no-conditional-statements";
import type {
  InvalidTestCaseSet,
  MessagesOf,
  OptionsOf,
} from "~/tests/helpers/util";

const tests: Array<
  InvalidTestCaseSet<MessagesOf<typeof rule>, OptionsOf<typeof rule>>
> = [];

export default tests;
