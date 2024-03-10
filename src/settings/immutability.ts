import { type SharedConfigurationSettings } from "@typescript-eslint/utils";
import {
  Immutability,
  getDefaultOverrides as getDefaultImmutabilityOverrides,
  type ImmutabilityOverrides,
  type TypeSpecifier,
} from "is-immutable-type";

declare module "@typescript-eslint/utils" {
  type OverridesSetting = {
    type: TypeSpecifier;
    to: Immutability | keyof typeof Immutability;
    from?: Immutability | keyof typeof Immutability;
  };

  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions, @typescript-eslint/no-shadow
  interface SharedConfigurationSettings {
    immutability?: {
      overrides?:
        | OverridesSetting[]
        | {
            keepDefault?: boolean;
            values?: OverridesSetting[];
          };
    };
  }
}

/**
 * The settings that have been loaded - so we don't have to reload them.
 */
const cachedSettings = new WeakMap<
  NonNullable<SharedConfigurationSettings["immutability"]>,
  ImmutabilityOverrides | undefined
>();

/**
 * Get the immutability overrides defined in the settings.
 */
export function getImmutabilityOverrides({
  immutability,
}: SharedConfigurationSettings): ImmutabilityOverrides | undefined {
  if (immutability === undefined) {
    return undefined;
  }
  if (!cachedSettings.has(immutability)) {
    const overrides = loadImmutabilityOverrides(immutability);

    // eslint-disable-next-line functional/no-expression-statements
    cachedSettings.set(immutability, overrides);
    return overrides;
  }
  return cachedSettings.get(immutability);
}

/**
 * Get all the overrides and upgrade them.
 */
function loadImmutabilityOverrides(
  immutabilitySettings: SharedConfigurationSettings["immutability"],
): ImmutabilityOverrides | undefined {
  const overridesSetting = immutabilitySettings?.overrides;

  if (overridesSetting === undefined) {
    return undefined;
  }

  const raw = Array.isArray(overridesSetting)
    ? overridesSetting
    : overridesSetting.values ?? [];

  const upgraded = raw.map((rawValue) => {
    const { type, to, from, ...rest } = rawValue;
    const value = {
      type,
      to: typeof to === "string" ? Immutability[to] : to,
      from:
        from === undefined
          ? undefined
          : typeof from === "string"
          ? Immutability[from]
          : from,
    } as ImmutabilityOverrides[number];

    /* c8 ignore start */
    if (value.type === undefined) {
      // eslint-disable-next-line functional/no-throw-statements
      throw new Error(
        `Override is missing required "type" property. Value: "${JSON.stringify(
          rawValue,
        )}"`,
      );
    }
    if (value.to === undefined) {
      // eslint-disable-next-line functional/no-throw-statements
      throw new Error(
        `Override is missing required "to" property. Value: "${JSON.stringify(
          rawValue,
        )}"`,
      );
    }
    const restKeys = Object.keys(rest);
    if (restKeys.length > 0) {
      // eslint-disable-next-line functional/no-throw-statements
      throw new Error(
        `Override is contains unknown property(s) "${restKeys.join(
          ", ",
        )}". Value: "${JSON.stringify(rawValue)}"`,
      );
    }
    /* c8 ignore stop */

    return value;
  });

  const keepDefault =
    Array.isArray(overridesSetting) || overridesSetting.keepDefault !== false;

  return keepDefault
    ? [...getDefaultImmutabilityOverrides(), ...upgraded]
    : upgraded;
}
