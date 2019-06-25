import { JSONSchema4 } from "json-schema";

export type IgnoreLocalOption = {
  readonly ignoreLocal?: boolean;
};
export const IgnoreLocalSchema: JSONSchema4 = {
  type: "object",
  properties: {
    ignoreLocal: {
      type: "boolean"
    }
  },
  additionalProperties: false
};

export interface IgnoreOption {
  readonly ignorePattern?: string | Array<string>;
  readonly ignorePrefix?: string | Array<string>;
  readonly ignoreSuffix?: string | Array<string>;
}
export const IgnoreSchema: JSONSchema4 = {
  type: "object",
  properties: {
    ignorePattern: {
      type: ["string", "array"],
      items: {
        type: "string"
      }
    },
    ignorePrefix: {
      type: ["string", "array"],
      items: {
        type: "string"
      }
    },
    ignoreSuffix: {
      type: ["string", "array"],
      items: {
        type: "string"
      }
    }
  },
  additionalProperties: false
};
