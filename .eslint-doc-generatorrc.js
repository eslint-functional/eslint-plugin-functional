const { format } = require('prettier');

/** @type {import('eslint-doc-generator').GenerateOptions} */
const config = {
  ignoreConfig: ['all', 'off'],
  ruleDocSectionInclude: ['Rule Details'],
  ruleListSplit: 'meta.docs.category',
  postprocess: doc => format(doc, { parser: 'markdown' }),
};

module.exports = config;
