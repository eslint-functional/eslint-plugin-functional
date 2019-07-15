import { JSONSchema4 } from "json-schema";

export type AssumeTypesOption = {
  readonly assumeTypes:
    | boolean
    | {
        readonly forArrays?: boolean;
        readonly forObjects?: boolean;
      };
};

export const assumeTypesOptionSchema: JSONSchema4 = {
  type: "object",
  properties: {
    assumeTypes: {
      oneOf: [
        {
          type: "boolean"
        },
        {
          type: "object",
          properties: {
            forArrays: {
              type: "boolean"
            },
            forObjects: {
              type: "boolean"
            }
          },
          additionalProperties: false
        }
      ]
    }
  },
  additionalProperties: false
};
