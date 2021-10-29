const path = require('path')
const { fs } = require('node-extra')

const commitlintHandle = (absolutePath: string) => {
  // commitlint.config.js handle
  const commitlintPath = path.resolve(absolutePath, 'commitlint.config.js')
  fs.wContent(
    commitlintPath,
    `module.exports = { extends: ["@commitlint/config-angular"] };`,
    0
  )
}

export default commitlintHandle
