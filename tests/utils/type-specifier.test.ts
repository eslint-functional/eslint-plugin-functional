import assert from "node:assert/strict";
import path from "node:path";

import { clearCaches, parseForESLint } from "@typescript-eslint/parser-native";
import dedent from "dedent";
import ts from "typescript";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { typeMatchesPattern } from "#/utils/type-specifier";

const filePath = path.join(import.meta.dirname, "../fixture/file.ts");
const code = dedent`
  type Alias = { readonly value: string };
  type MutableAlias = { value: string };
  type Generic<T> = { readonly value: T };
  type Instance = Generic<string>;
  type Primitive = string;
`;

function createProgram(backend: "typescript" | "tsgo") {
  clearCaches();
  const program =
    parseForESLint(code, {
      filePath,
      tsconfigRootDir: path.dirname(filePath),
      projectService: backend === "tsgo" ? { EXPERIMENTAL_backend: backend } : true,
    }).services.program ?? assert.fail("Missing program");
  const source = program.getSourceFile(filePath) ?? assert.fail("Missing source file");
  const nodes = new Map(source.statements.filter(ts.isTypeAliasDeclaration).map((node) => [node.name.text, node.type]));
  return { program, nodes };
}

afterAll(() => {
  clearCaches();
});

describe.each(["typescript", "tsgo"] as const)("type patterns with %s", (backend) => {
  let mut_fixture: ReturnType<typeof createProgram>;
  beforeAll(() => {
    mut_fixture = createProgram(backend);
  });

  it.each([
    { name: "Alias", include: ["Alias"], exclude: [], expected: true },
    { name: "Alias", include: [/^Ali/u], exclude: [], expected: true },
    { name: "Alias", include: ["Absent"], exclude: [], expected: false },
    { name: "Alias", include: ["Alias"], exclude: ["Alias"], expected: false },
    { name: "Alias", include: [/^Ali/u], exclude: [/^Ali/u], expected: false },
    { name: "MutableAlias", include: ["MutableAlias"], exclude: [], expected: true },
    { name: "Instance", include: ["Instance"], exclude: [], expected: true },
    { name: "Primitive", include: ["string"], exclude: [], expected: true },
  ])("matches $name with $include excluding $exclude", ({ name, include, exclude, expected }) => {
    const { program, nodes } = mut_fixture;
    const node = nodes.get(name) ?? assert.fail("Missing type node");
    const type = program.getTypeChecker().getTypeFromTypeNode(node);
    expect(typeMatchesPattern(program, type, null, include, exclude)).toBe(expected);
    expect(typeMatchesPattern(program, type, node, include, exclude)).toBe(expected);
  });
});

describe("classic generic targets", () => {
  it("matches the original alias of an instantiated type", () => {
    const { program, nodes } = createProgram("typescript");
    const node = nodes.get("Instance") ?? assert.fail("Missing type node");
    const type = program.getTypeChecker().getTypeFromTypeNode(node);
    expect(typeMatchesPattern(program, type, null, ["Generic"], [])).toBe(true);
    expect(typeMatchesPattern(program, type, null, ["Generic"], ["Generic"])).toBe(false);
  });
});
