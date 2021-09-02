const path = require('path')
const { fs } = require('node-extra')

const prettierrcHandle = () => {
  const prettierrcPath = path.resolve(process.cwd(), '.prettierrc.js')
  fs.wContent(
    prettierrcPath,
    `module.exports = {
      "semi": false,
      "singleQuote": true,
      "trailingComma": "none",
      "endOfLine": "lf"
    };`
  )
}

export default prettierrcHandle
