import type { JSONSchema4, JSONSchema4ObjectSchema } from "@typescript-eslint/utils/json-schema";
import { deepmerge } from "deepmerge-ts";

const typeSpecifierPatternSchemaProperties: JSONSchema4ObjectSchema["properties"] = {
  name: schemaInstanceOrInstanceArray({
    type: "string",
  }),
  pattern: schemaInstanceOrInstanceArray({
    type: "string",
  }),
  ignoreName: schemaInstanceOrInstanceArray({
    type: "string",
  }),
  ignorePattern: schemaInstanceOrInstanceArray({
    type: "string",
  }),
};

const typeSpecifierSchema: JSONSchema4 = {
  oneOf: [
    {
      type: "object",
      properties: {
        ...typeSpecifierPatternSchemaProperties,
        from: {
          type: "string",
          enum: ["file"],
        },
        path: {
          type: "string",
        },
      },
      additionalProperties: false,
    },
    {
      type: "object",
      properties: {
        ...typeSpecifierPatternSchemaProperties,
        from: {
          type: "string",
          enum: ["lib"],
        },
      },
      additionalProperties: false,
    },
    {
      type: "object",
      properties: {
        ...typeSpecifierPatternSchemaProperties,
        from: {
          type: "string",
          enum: ["package"],
        },
        package: {
          type: "string",
        },
      },
      additionalProperties: false,
    },
  ],
};

export function schemaInstanceOrInstanceArray(
  items: JSONSchema4,
): NonNullable<JSONSchema4ObjectSchema["properties"]>[string] {
  return {
    oneOf: [
      items,
      {
        type: "array",
        items,
      },
    ],
  };
}

export function overridableOptionsSchema(
  coreOptionsPropertiesSchema: NonNullable<JSONSchema4ObjectSchema["properties"]>,
): JSONSchema4 {
  return {
    type: "object",
    properties: deepmerge(coreOptionsPropertiesSchema, {
      overrides: {
        type: "array",
        items: {
          type: "object",
          properties: {
            specifiers: schemaInstanceOrInstanceArray(typeSpecifierSchema),
            options: {
              type: "object",
              properties: coreOptionsPropertiesSchema,
              additionalProperties: false,
            },
            inherit: {
              type: "boolean",
            },
            disable: {
              type: "boolean",
            },
          },
          additionalProperties: false,
        },
      },
    } satisfies JSONSchema4ObjectSchema["properties"]),
    additionalProperties: false,
  };
}
