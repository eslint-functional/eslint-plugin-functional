import type { SharedConfigurationSettings } from "@typescript-eslint/utils";
import type { ImmutabilityOverrides } from "is-immutable-type";
import {
  Immutability,
  getDefaultOverrides as getDefaultImmutabilityOverrides,
} from "is-immutable-type";
import type { JSONSchema4 } from "json-schema";
import type { ReadonlyDeep } from "type-fest";

import { isReadonlyArray } from "~/util/typeguard";

declare module "@typescript-eslint/utils" {
  type OverridesSetting = {
    name?: string;
    pattern?: string;
    to: Immutability | keyof typeof Immutability;
    from?: Immutability | keyof typeof Immutability;
  };

  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions, @typescript-eslint/no-shadow
  interface SharedConfigurationSettings {
    immutability?: ReadonlyDeep<{
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
  ImmutabilityOverrides | undefined
> = new WeakMap();

/**
 * Get the immutability overrides defined in the settings.
 */
export function getImmutabilityOverrides(
  settings: ReadonlyDeep<SharedConfigurationSettings>
): ImmutabilityOverrides | undefined {
  if (!cachedSettings.has(settings)) {
    const overrides = loadImmutabilityOverrides(settings);

    // eslint-disable-next-line functional/no-expression-statements
    cachedSettings.set(settings, overrides);
    return overrides;
  }
  return cachedSettings.get(settings);
}

/**
 * Get all the overrides and upgrade them.
 */
function loadImmutabilityOverrides(
  settings: ReadonlyDeep<SharedConfigurationSettings>
): ImmutabilityOverrides | undefined {
  const { immutability: immutabilitySettings } = settings;
  const overridesSetting = immutabilitySettings?.overrides;

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
        to: typeof to !== "string" ? to : Immutability[to],
        from:
          from === undefined
            ? undefined
            : typeof from !== "string"
            ? from
            : Immutability[from],
      } as ImmutabilityOverrides[number])
  );

  const keepDefault =
    isReadonlyArray(overridesSetting) || overridesSetting.keepDefault !== false;

  return keepDefault
    ? [...getDefaultImmutabilityOverrides(), ...upgraded]
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
      immutability: {
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
                              enum: Object.values(Immutability),
                            },
                            from: {
                              type: ["string", "number"],
                              enum: Object.values(Immutability),
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
                              enum: Object.values(Immutability),
                            },
                            from: {
                              type: ["string", "number"],
                              enum: Object.values(Immutability),
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
                          enum: Object.values(Immutability),
                        },
                        from: {
                          type: ["string", "number"],
                          enum: Object.values(Immutability),
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
                          enum: Object.values(Immutability),
                        },
                        from: {
                          type: ["string", "number"],
                          enum: Object.values(Immutability),
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
