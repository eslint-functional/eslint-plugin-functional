import { deepmergeCustom } from "deepmerge-ts";

export const mergeConfigs = deepmergeCustom<
  {},
  {
    keyPath: PropertyKey[];
  }
>({
  metaDataUpdater: (previousMeta, metaMeta) => {
    if (previousMeta === undefined) {
      if (metaMeta.key === undefined) {
        return { keyPath: [] };
      }
      return { keyPath: [metaMeta.key] };
    }
    if (metaMeta.key === undefined) {
      return previousMeta;
    }
    return {
      ...metaMeta,
      keyPath: [...previousMeta.keyPath, metaMeta.key],
    };
  },
  mergeArrays(values, utils, meta) {
    if (
      meta !== undefined &&
      meta.keyPath.length >= 2 &&
      meta.keyPath[0] === "rules"
    ) {
      return utils.defaultMergeFunctions.mergeOthers(values);
    }

    return utils.actions.defaultMerge;
  },
});
