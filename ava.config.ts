/**
 * Get the intended boolean value from the given string.
 */
function getBoolean(value: unknown) {
  if (value === undefined) {
    return false;
  }
  const asNumber = Number(value);
  return Number.isNaN(asNumber)
    ? Boolean(String(value).toLowerCase().replace("false", ""))
    : Boolean(asNumber);
}

const testAllFiles = getBoolean(process.env.TEST_ALL_FILES);
const useCompiledTests = getBoolean(process.env.USE_COMPILED_TESTS);
const onlyTestWorkFile = getBoolean(process.env.ONLY_TEST_WORK_FILE);

const avaCommonConfig = {
  files: testAllFiles
    ? ["tests/rules/*.test.*"]
    : onlyTestWorkFile
    ? ["tests/rules/work.test.*"]
    : ["tests/**/!(work)*.test.*"],
  timeout: "5m",
};

const avaTsConfig = {
  ...avaCommonConfig,
  extensions: ["ts"],
  require: ["ts-node/register", "tsconfig-paths/register"],
  environmentVariables: {
    TS_NODE_PROJECT: "tests/tsconfig.json",
  },
};

const avaJsConfig = {
  ...avaCommonConfig,
  files: avaCommonConfig.files.map((file) => `build/${file}`),
  extensions: ["js"],
  require: ["tsconfig-paths/register"],
  environmentVariables: {
    TS_NODE_PROJECT: "build/tests/tsconfig.json",
  },
};

export default useCompiledTests ? avaJsConfig : avaTsConfig;
