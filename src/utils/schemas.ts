import type {
  JSONSchema4,
  JSONSchema4ObjectSchema,
} from "@typescript-eslint/utils/json-schema";

const typeSpecifierPatternSchemaProperties: JSONSchema4ObjectSchema["properties"] =
  {
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

export const typeSpecifiersSchema: JSONSchema4 =
  schemaInstanceOrInstanceArray(typeSpecifierSchema);

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
