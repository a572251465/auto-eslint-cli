const fs = require('fs');
const path = require('path');
const { fs: fsUtils } = require('node-extra');

const prettierrcHandle = (absolutePath: string) => {
  const prettierrcPath = path.resolve(absolutePath, '.prettierrc.js');
  fsUtils.wContent(
    prettierrcPath,
    `module.exports = {
      "semi": false,
      "singleQuote": true,
      "trailingComma": "none",
      "endOfLine": "lf"
    };`
  );

  const fromPath = path.resolve(__dirname, './cli-template/ignore', '.prettierignore');
  fs.copyFileSync(fromPath, path.resolve(absolutePath, '.prettierignore'));
};

export default prettierrcHandle;
