const path = require('path')
const { fs } = require('node-extra')

const cwd = process.cwd()

const commitlintHandle = () => {
  // commitlint.config.js handle
  const commitlintPath = path.resolve(cwd, 'commitlint.config.js')
  fs.wContent(
    commitlintPath,
    `module.exports = { extends: ["@commitlint/config-angular"] };`,
    0
  )
}

export default commitlintHandle
