const chalk = require('chalk')
const { program } = require('commander')
const path = require('path')
const fs = require('fs')
const ProgressBar = require('progress')

const packageError = 'Error: file package.json does not exist, init fail'
const cwd = process.cwd()

// eslint-disable-next-line consistent-return,no-async-promise-executor
const promptHandle = () =>
  // eslint-disable-next-line no-async-promise-executor
  new Promise(async (resolve) => {
    await new Promise((resolve1) => {
      console.log(chalk.cyan(' File analysis in progress ...'))
      const timer = setTimeout(() => {
        resolve1(true)
        clearTimeout(timer)
      }, 1000)
    })
    const bar = new ProgressBar(':bar :current/:total%', { total: 100 })
    const timer = setInterval(() => {
      bar.tick()
      if (bar.complete) {
        clearInterval(timer)
        require('./cli-prompt/index.ts')()
        resolve(true)
      }
    }, 50)
  })

// eslint-disable-next-line consistent-return
const run = async () => {
  const packagePath = path.resolve(cwd, 'package.json')
  let stat = null
  try {
    stat = fs.statSync(packagePath)
    if (!stat.isFile()) {
      console.error(chalk.red(packageError))
      return false
    }

    // exec input
    await promptHandle()
  } catch (e) {
    console.error(chalk.red(packageError))
  }
}

program
  .option('-n --name', 'please input config file name')
  .command('init')
  .description('eslint config init handle')
  .action(async () => {
    await run()
  })

program.parse(process.argv)
