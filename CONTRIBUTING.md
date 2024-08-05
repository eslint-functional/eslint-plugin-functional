# Contributing

## How to

For new features file an issue. For bugs, file an issue and optionally file a PR with a failing test.

## How to develop

To execute the tests run `pnpm test`.

To learn about ESLint plugin development see the
[relevant section](https://eslint.org/docs/developer-guide/working-with-plugins) of the ESLint docs.
You can also checkout the [typescript-eslint](https://github.com/typescript-eslint/typescript-eslint) repo which has
some more information specific to TypeScript.

In order to know which AST nodes are created for a snippet of TypeScript code you can use
[AST explorer](https://astexplorer.net/) with options JavaScript and @typescript-eslint/parser.

### How to publish

Publishing is handled by [semantic release](https://github.com/semantic-release/semantic-release#readme) -
there shouldn't be any need to publish manually.
