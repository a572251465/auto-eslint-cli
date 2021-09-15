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
  lintStagedSuffix: string
  absolutePath: string
  [keyName: string]: string
}) => {
  const packagePath = pathCli.resolve(options.absolutePath, 'package.json')
  // eslint-disable-next-line import/no-dynamic-require
  const pkContent = require(packagePath)
  const { devDependencies = {}, dependencies = {} } = pkContent
  const isVite = !!devDependencies.vite || !!dependencies.vite

  const judgeLanguage: ILanguageType = judgeLanguageHandle(options.absolutePath)

  // 设置执行的预设
  const plugins = defaultPresets as {
    plugin: string
    version: string
    prefix: string
  }[]
  const execPresets: { plugin: string; version: string; env: string }[] =
    plugins.map((item) => ({
      plugin: item.plugin,
      version: item.version,
      env: 'devDependencies'
    }))

  if (!judgeLanguage.vue3 || (judgeLanguage.vue3 && isVite)) {
    const localIndex = execPresets.findIndex(
      (item) => item.plugin === 'eslint-import-resolver-webpack'
    )
    execPresets.splice(localIndex, 1)
  }

  // husky file handle
  await huskyHandle(options.absolutePath, options.lintStagedSuffix)

  // eslintrc.js/json handle
  eslintConfigHandle({
    importResolver: judgeLanguage.vue3 && !isVite,
    absolutePath: options.absolutePath
  })

  // commitlint file cliHandle
  commitlintHandle(options.absolutePath)

  // package file handle
  const packageOptions = {
    execPresets,
    judgeLanguage,
    lintStagedSuffix: options.lintStagedSuffix,
    absolutePath: options.absolutePath
  }
  packageHandle(packageOptions)

  // .prettierrc.js handle
  prettierrcHandle(options.absolutePath)
  console.log(chalkCli.yellow(`success: eslint dependency setting success`))

  let gitHookState = true
  try {
    await processUtils.runCommand('npx', ['husky', 'install'], {
      cwd: process.cwd()
    })
  } catch (e) {
    gitHookState = false
    console.log(e)
  }

  // exec install
  const dirNames = fsCli.readdirSync(options.absolutePath) as string[]
  processUtils
    .runCommand(
      options.tool,
      ['install'].concat(dirNames.includes('lerna.json') ? ['-W'] : []),
      {
        cwd: options.absolutePath
      }
    )
    .then(() => {
      console.log(chalkCli.cyan('yarn lint'))
      if (!gitHookState) {
        console.log(chalkCli.red('git hook install fail.'))
        console.log(
          chalkCli.red(
            'Tips: Window user - please run command<npx husky install> (window用户-请运行命令 {npx husky install})'
          )
        )
        console.log(
          chalkCli.red(
            'Tips: Mac user - please run command {npx husky install} in then current dir with iterm2(mac用户-请使用iterm2运行命令 {npx husky install})'
          )
        )
      }
    })
}

module.exports = cliHandle
