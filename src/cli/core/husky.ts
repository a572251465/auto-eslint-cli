const cwd = process.cwd()
const path = require('path')
const { fs } = require('node-extra')

const huskyHandle = async () => {
  const huskyPath: string = path.resolve(cwd, '.husky')
  if (!fs.isDirExists(huskyPath)) {
    const fromPath = path.resolve(__dirname, './cli-template', '.husky')
    await fs.cpFile(fromPath, huskyPath)
  }
}

export default huskyHandle
