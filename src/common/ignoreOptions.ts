import { TSESTree } from "@typescript-eslint/typescript-estree";
import { JSONSchema4 } from "json-schema";

import { inClass, inFunction, inInterface } from "../util/in";
import { RuleContext } from "../util/rule";

type AllRuleOptions = IgnoreLocalOption &
  IgnoreOption &
  IgnoreRestParametersOption &
  IgnoreClassOption &
  IgnoreInterfaceOption &
  IgnoreNewArrayOption;

export type IgnoreLocalOption = {
  readonly ignoreLocal?: boolean;
};
export const ignoreLocalOptionSchema: JSONSchema4 = {
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
export const ignoreOptionSchema: JSONSchema4 = {
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

export interface IgnoreRestParametersOption {
  readonly ignoreRestParameters?: boolean;
}

export interface IgnoreReturnType {
  readonly ignoreReturnType?: boolean;
}

export interface IgnoreClassOption {
  readonly ignoreClass?: boolean;
}

export interface IgnoreInterfaceOption {
  readonly ignoreInterface?: boolean;
}

export interface IgnoreNewArrayOption {
  readonly ignoreNewArray?: boolean;
}

type CheckFunction<Context, IgnoreOptions, Node extends TSESTree.Node> = (
  context: Context,
  ignoreOptions: IgnoreOptions,
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  extraOptions: ReadonlyArray<any>
) => (node: Node) => void;

/**
 * Check a node taking into account the ignore options.
 */
export function checkNodeWithIgnore<
  Context extends RuleContext<string, [IgnoreOptions]>,
  IgnoreOptions extends AllRuleOptions,
  Node extends TSESTree.Node
>(
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  check: (context: Context, options: ReadonlyArray<any>) => (node: Node) => void
): CheckFunction<Context, IgnoreOptions, Node> {
  return (
    context: Context,
    ignoreOptions: IgnoreOptions,
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    otherOptions: ReadonlyArray<any>
  ) => {
    return (node: Node) => {
      // Skip checking in functions if ignore-local is set.
      if (ignoreOptions.ignoreLocal && inFunction(node)) {
        return;
      }

      // Skip checking in classes/interfaces if ignore-class/ignore-interface is
      // set.
      if (
        (ignoreOptions.ignoreClass && inClass(node)) ||
        (ignoreOptions.ignoreInterface && inInterface(node))
      ) {
        return;
      }

      // Run the check.
      return check(context, [ignoreOptions, ...otherOptions]);
    };
  };
}
