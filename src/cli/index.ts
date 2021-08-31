const pathCli = require('path')
const chalkCli = require('chalk')
const { fs: fsUtils, process: processUtils } = require('node-extra')
const defaultPresets = require('../cli-shared/presets.ts').default
const huskyHandle = require('./core/husky.ts').default
const eslintConfigHandle = require('./core/eslintConfigHandle.ts').default

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

  // commitlint.config.js handle TODO
  const commitlintPath = pathCli.resolve(cwd, 'commitlint.config.js')
  fsUtils.wContent(
    commitlintPath,
    `
    module.exports = { extends: ["@commitlint/config-angular"] };
  `
  )

  // package scripts and dependencies
  // eslint-disable-next-line import/no-dynamic-require
  const packageJson = require(packagePath)
  if (!packageJson.scripts) {
    packageJson.scripts = {}
  }
  packageJson.scripts = {
    ...packageJson.scripts,
    lint: 'eslint --ext .js,.ts,.vue . && prettier --check .',
    'lint:fix': 'eslint --fix --ext .js,.ts,.vue . && prettier --write .',
    prepare: 'husky install'
  }
  execPresets.forEach((item) => {
    const { plugin, version, env } = item
    if (!Reflect.has(packageJson, env)) {
      packageJson[env] = {}
    }
    packageJson[env][plugin] = version
  })

  // package setting init-staged
  packageJson['lint-staged'] = {
    'src/**/*.{js,vue,ts}': ['yarn lint']
  }
  fsUtils.wContent(packagePath, packageJson)

  // .prettierrc.js handle
  const prettierrcPath = pathCli.resolve(cwd, '.prettierrc.js')
  fsUtils.wContent(
    prettierrcPath,
    `
    module.exports = {
      "semi": false,
      "singleQuote": true,
      "trailingComma": "none",
      "endOfLine": "lf"
    };
  `
  )
  console.log(chalkCli.yellow(`success: eslint dependency setting success`))

  // exec install
  processUtils.runCommand(options.tool, ['install']).then(() => {
    console.log(chalkCli.cyan('yarn lint'))
  })
}

module.exports = cliHandle
