import test from "ava";

import { mergeConfigs } from "~/utils/merge-configs";

test("should replace rule config", (t) => {
  const a = {
    rules: {
      "plugin/rule": ["error", { foo: "bar" }],
    },
  };
  const b = {
    rules: {
      "plugin/rule": ["error", { baz: "qux" }],
    },
  };

  const expected = {
    rules: {
      "plugin/rule": b.rules["plugin/rule"],
    },
  };

  const result = mergeConfigs(a, b);

  t.deepEqual(result, expected, "result is not merged correctly");
  t.is(
    result.rules["plugin/rule"],
    expected.rules["plugin/rule"],
    "rule value was not replaced"
  );
});
