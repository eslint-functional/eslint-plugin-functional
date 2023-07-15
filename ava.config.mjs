/**
 * Get the intended boolean value from the given string.
 */
function getBoolean(value) {
  if (value === undefined) {
    return false;
  }
  const asNumber = Number(value);
  return Number.isNaN(asNumber)
    ? Boolean(String(value).toLowerCase().replace("false", ""))
    : Boolean(asNumber);
}

const useCompiledTests = getBoolean(process.env["USE_COMPILED_TESTS"]);
const onlyTestWorkFile = getBoolean(process.env["ONLY_TEST_WORK_FILE"]);

const avaCommonConfig = {
  files: onlyTestWorkFile
    ? ["tests/rules/work.test.*"]
    : ["tests/**/!(work)*.test.*"],
  timeout: "5m",
  nodeArguments: ["--no-warnings=ExperimentalWarning"],
};

const avaTsConfig = {
  ...avaCommonConfig,
  extensions: ["ts"],
  require: ["ts-node/register", "tsconfig-paths/register"],
};

const avaJsConfig = {
  ...avaCommonConfig,
  files: avaCommonConfig.files.map((file) => `tests-compiled/${file}`),
};

export default useCompiledTests ? avaJsConfig : avaTsConfig;
