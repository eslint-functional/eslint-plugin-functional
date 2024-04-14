import { type JSONSchema4 } from "@typescript-eslint/utils/json-schema";

const typeSpecifierSchema: JSONSchema4 = {
  oneOf: [
    {
      type: "object",
      properties: {
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

export const typeSpecifiersSchema: JSONSchema4 = {
  oneOf: [
    {
      type: "array",
      items: typeSpecifierSchema,
    },
    typeSpecifierSchema,
  ],
};
