import { describe, expect, it } from "vitest";

import { mergeConfigs } from "#eslint-plugin-functional/utils/merge-configs";

describe("merge eslint configs", () => {
  it("should replace rule config", (t) => {
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

    expect(result).to.deep.equal(expected, "result is not merged correctly");
    expect(result.rules["plugin/rule"]).to.equal(
      expected.rules["plugin/rule"],
      "rule value was not replaced",
    );
  });
});
