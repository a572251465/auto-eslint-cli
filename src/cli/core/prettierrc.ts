const fs = require('fs');
const path = require('path');
const { fs: fsUtils } = require('node-extra');

const prettierrcHandle = () => {
  const prettierrcPath = path.resolve(process.cwd(), '.prettierrc.js');
  fsUtils.wContent(
    prettierrcPath,
    `module.exports = {
      "semi": false,
      "singleQuote": true,
      "trailingComma": "none",
      "endOfLine": "lf"
    };`
  );

  const fromPath = path.resolve(
    __dirname,
    './cli-template/ignore',
    '.prettierignore'
  );
  fs.copyFileSync(fromPath, path.resolve(process.cwd(), '.prettierignore'));
};

export default prettierrcHandle;
