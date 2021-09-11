const path = require('path');
const { fs } = require('node-extra');

const preCommitHandle = () => `#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

node .lintstagedrc.js
`;

const huskyHandle = async (absolutePath: string, lintStagedSuffix: string) => {
  const huskyPath: string = path.resolve(absolutePath, '.husky');

  const fromPath = path.resolve(__dirname, './cli-template', '.husky');
  await fs.cpFile(fromPath, huskyPath);

  if (lintStagedSuffix === '.js') {
    const writePath = path.resolve(absolutePath, '.husky/pre-commit');
    fs.wContent(writePath, preCommitHandle(), 0);
  }
};

export default huskyHandle;
