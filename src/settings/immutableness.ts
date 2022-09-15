import type { SharedConfigurationSettings } from "@typescript-eslint/utils";
import type { ImmutablenessOverrides } from "is-immutable-type";
import {
  Immutableness,
  getDefaultOverrides as getDefaultImmutablenessOverrides,
} from "is-immutable-type";
import type { JSONSchema4 } from "json-schema";
import type { ReadonlyDeep } from "type-fest";

import { isReadonlyArray } from "~/util/typeguard";

declare module "@typescript-eslint/utils" {
  type OverridesSetting = {
    name?: string;
    pattern?: string;
    to: Immutableness | keyof typeof Immutableness;
    from?: Immutableness | keyof typeof Immutableness;
  };

  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions, @typescript-eslint/no-shadow
  interface SharedConfigurationSettings {
    immutableness?: ReadonlyDeep<{
      overrides?:
        | OverridesSetting[]
        | {
            keepDefault?: boolean;
            values?: OverridesSetting[];
          };
    }>;
  }
}

/**
 * The settings that have been loaded - so we don't have to reload them.
 */
const cachedSettings: WeakMap<
  ReadonlyDeep<SharedConfigurationSettings>,
  ImmutablenessOverrides | undefined
> = new WeakMap();

/**
 * Get the immutableness overrides defined in the settings.
 */
export function getImmutablenessOverrides(
  settings: ReadonlyDeep<SharedConfigurationSettings>
): ImmutablenessOverrides | undefined {
  if (!cachedSettings.has(settings)) {
    const overrides = loadImmutablenessOverrides(settings);

    // eslint-disable-next-line functional/no-expression-statement
    cachedSettings.set(settings, overrides);
    return overrides;
  }
  return cachedSettings.get(settings);
}

/**
 * Get all the overrides and upgrade them.
 */
function loadImmutablenessOverrides(
  settings: ReadonlyDeep<SharedConfigurationSettings>
): ImmutablenessOverrides | undefined {
  const { immutableness: immutablenessSettings } = settings;
  const overridesSetting = immutablenessSettings?.overrides;

  if (overridesSetting === undefined) {
    return undefined;
  }

  const raw = isReadonlyArray(overridesSetting)
    ? overridesSetting
    : overridesSetting.values ?? [];

  const upgraded = raw.map(
    ({ name, pattern, to, from }) =>
      ({
        name,
        pattern: pattern === undefined ? pattern : new RegExp(pattern, "u"),
        to: typeof to !== "string" ? to : Immutableness[to],
        from:
          from === undefined
            ? undefined
            : typeof from !== "string"
            ? from
            : Immutableness[from],
      } as ImmutablenessOverrides[number])
  );

  const keepDefault =
    isReadonlyArray(overridesSetting) || overridesSetting.keepDefault !== false;

  return keepDefault
    ? [...getDefaultImmutablenessOverrides(), ...upgraded]
    : upgraded;
}

/**
 * The schema for the rule options.
 */
export const sharedConfigurationSettingsSchema: JSONSchema4 = [
  {
    type: "object",
    properties: {
      type: "object",
      immutableness: {
        properties: {
          overrides: {
            oneOf: [
              {
                type: "object",
                properties: {
                  keepDefault: {
                    type: "boolean",
                  },
                  values: {
                    type: "array",
                    items: {
                      oneOf: [
                        {
                          type: "object",
                          properties: {
                            name: {
                              type: "string",
                            },
                            to: {
                              type: ["string", "number"],
                              enum: Object.values(Immutableness),
                            },
                            from: {
                              type: ["string", "number"],
                              enum: Object.values(Immutableness),
                            },
                          },
                          required: ["name", "to"],
                          additionalProperties: false,
                        },
                        {
                          type: "object",
                          properties: {
                            pattern: {
                              type: "string",
                            },
                            to: {
                              type: ["string", "number"],
                              enum: Object.values(Immutableness),
                            },
                            from: {
                              type: ["string", "number"],
                              enum: Object.values(Immutableness),
                            },
                          },
                          required: ["pattern", "to"],
                          additionalProperties: false,
                        },
                      ],
                    },
                  },
                },
                additionalProperties: false,
              },
              {
                type: "array",
                items: {
                  oneOf: [
                    {
                      type: "object",
                      properties: {
                        name: {
                          type: "string",
                        },
                        to: {
                          type: ["string", "number"],
                          enum: Object.values(Immutableness),
                        },
                        from: {
                          type: ["string", "number"],
                          enum: Object.values(Immutableness),
                        },
                      },
                      required: ["name", "to"],
                      additionalProperties: false,
                    },
                    {
                      type: "object",
                      properties: {
                        pattern: {
                          type: "string",
                        },
                        to: {
                          type: ["string", "number"],
                          enum: Object.values(Immutableness),
                        },
                        from: {
                          type: ["string", "number"],
                          enum: Object.values(Immutableness),
                        },
                      },
                      required: ["pattern", "to"],
                      additionalProperties: false,
                    },
                  ],
                },
              },
            ],
          },
        },
      },
      additionalProperties: false,
    },
    additionalProperties: true,
  },
];
