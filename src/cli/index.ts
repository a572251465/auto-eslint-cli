const pathCli = require('path')
const chalkCli = require('chalk')
const fsCli = require('fs')
const { process: processUtils } = require('node-extra')
const defaultPresets = require('../cli-shared/presets.ts').default
const huskyHandle = require('./core/husky.ts').default
const eslintConfigHandle = require('./core/eslintConfigHandle.ts').default
const commitlintHandle = require('./core/commitlint.ts').default
const packageHandle = require('./core/packageHandle.ts').default
const prettierrcHandle = require('./core/prettierrc.ts').default

const transformPresets: { [keyName: string]: string } = {
  'vue3&ts&vue-cli': 'vue3 + ts/ vue-cli',
  'rollup&ts': 'rollup + ts'
}

// cli 执行入口
const cliHandle = async (options: { preset: string; tool: string }) => {
  const cwd = process.cwd()
  const preset = transformPresets[options.preset]
  const packagePath = pathCli.resolve(cwd, 'package.json')
  // eslint-disable-next-line import/no-dynamic-require
  const pkContent = require(packagePath)
  const { devDependencies = {}, dependencies = {} } = pkContent

  // 设置执行的预设
  const execPresets: { plugin: string; version: string; env: string }[] = []
  const plugins = defaultPresets[preset].plugins as {
    plugin: string
    version: string
    prefix: string
  }[]
  plugins.forEach(({ plugin, version, prefix }) => {
    if (
      !devDependencies[plugin] ||
      !devDependencies[plugin].startsWith(prefix)
    ) {
      execPresets.push({ plugin, version, env: 'devDependencies' })
      return
    }
    if (!dependencies[plugin] || !dependencies[plugin].startsWith(prefix)) {
      execPresets.push({ plugin, version, env: 'dependencies' })
    }
  })

  // husky file handle
  await huskyHandle()

  // eslintrc.js/json handle
  eslintConfigHandle({
    importResolver: !options.preset.includes('rollup')
  })

  // commitlint file cliHandle
  commitlintHandle()

  // package file handle
  packageHandle(execPresets, options.preset)

  // .prettierrc.js handle
  prettierrcHandle()
  console.log(chalkCli.yellow(`success: eslint dependency setting success`))

  // exec install
  const dirNames = fsCli.readdirSync(cwd) as string[]
  processUtils
    .runCommand(
      options.tool,
      ['install'].concat(dirNames.includes('lerna.json') ? ['-W'] : [])
    )
    .then(() => {
      console.log(chalkCli.cyan('yarn lint'))
    })
}

module.exports = cliHandle
