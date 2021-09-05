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
const judgeLanguageHandle = require('./core/judgeLanguage.ts').default

interface ILanguageType {
  // vue2版本生成
  vue2: boolean
  // vue3版本生成
  vue3: boolean
  // react生成
  react: boolean
  // rollup cli
  rollupCli: boolean
}

const cliHandle = async (options: {
  tool: string
  [keyName: string]: string
}) => {
  const cwd = process.cwd()
  const packagePath = pathCli.resolve(cwd, 'package.json')
  // eslint-disable-next-line import/no-dynamic-require
  const pkContent = require(packagePath)
  const { devDependencies = {}, dependencies = {} } = pkContent
  const isVite = !!devDependencies.vite || !!dependencies.vite

  const judgeLanguage: ILanguageType = judgeLanguageHandle()

  // 设置执行的预设
  const execPresets: { plugin: string; version: string; env: string }[] = []
  const plugins = defaultPresets as {
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
  if (!judgeLanguage.vue3 || (judgeLanguage.vue3 && isVite)) {
    const localIndex = execPresets.findIndex(
      (item) => item.plugin === 'eslint-import-resolver-webpack'
    )
    execPresets.splice(localIndex, 1)
  }

  // husky file handle
  await huskyHandle()

  // eslintrc.js/json handle
  eslintConfigHandle({
    importResolver: judgeLanguage.vue3 && !isVite
  })

  // commitlint file cliHandle
  commitlintHandle()

  // package file handle
  packageHandle(execPresets, judgeLanguage)

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
