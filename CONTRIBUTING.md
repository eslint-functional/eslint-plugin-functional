# Contributing

## How to

For new features file an issue. For bugs, file an issue and optionally file a PR with a failing test.

## How to develop

To execute the tests run `yarn test`.

To learn about ESLint plugin development see the [relevant section](https://eslint.org/docs/developer-guide/working-with-plugins) of the ESLint docs. You can also checkout the [typescript-eslint](https://github.com/typescript-eslint/typescript-eslint) repo which has some more information specific to TypeScript.

In order to know which AST nodes are created for a snippet of TypeScript code you can use [AST explorer](https://astexplorer.net/) with options JavaScript and @typescript-eslint/parser.

### Commit Messages

> tl;dr: use `npx cz` instead of `git commit`.

Commit messages must follow [Conventional Commit messages guidelines](https://www.conventionalcommits.org/en/v1.0.0/). You can use `npx cz` instead of `git commit` to run a interactive prompt to generate the commit message. We've customize the prompt specifically for this project. For more information see [commitizen](https://github.com/commitizen/cz-cli#readme).

### How to publish

Publishing is handled by [semantic release](https://github.com/semantic-release/semantic-release#readme) - there shouldn't be any need to publish manually.
