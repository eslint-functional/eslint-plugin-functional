// eslint-disable-next-line unicorn/import-style
export default await import("typescript")
  .then((module) => module.default)
  .catch(() => undefined);
