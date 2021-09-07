const chalk = require('chalk');
const { program } = require('commander');
const path = require('path');
const { fs } = require('node-extra');
const ProgressBar = require('progress');

const packageError = 'Error: file package.json does not exist, init fail';
const cwd = process.cwd();

// eslint-disable-next-line consistent-return,no-async-promise-executor
const promptHandle = (options: { y?: boolean }) =>
  // eslint-disable-next-line no-async-promise-executor
  new Promise(async (resolve) => {
    await new Promise((resolve1) => {
      console.log(chalk.cyan(' File analysis in progress ...'));
      const timer = setTimeout(() => {
        resolve1(true);
        clearTimeout(timer);
      }, 1000);
    });
    const bar = new ProgressBar(':bar :current/:total%', { total: 100 });
    const timer = setInterval(() => {
      bar.tick();
      if (bar.complete) {
        clearInterval(timer);
        if (options.y) {
          require('./cli/index.ts')({ language: 'vue', tool: 'npm' });
        } else {
          require('./cli-prompt/index.ts')();
        }
        resolve(true);
      }
    }, 50);
  });

// eslint-disable-next-line consistent-return
const run = async (options: { y?: boolean }) => {
  const packagePath = path.resolve(cwd, 'package.json');
  const isPackageExist = fs.isFileExists(packagePath);
  if (!isPackageExist) {
    console.error(chalk.red(packageError));
    return false;
  }

  const gitPath = path.resolve(cwd, '.git');
  const isGitExist = fs.isDirExists(gitPath);
  if (!isGitExist) {
    console.error(chalk.red(".git can't be found"));
    console.error(
      chalk.red(`please run command <${chalk.yellow('git init')}>`)
    );
    return false;
  }

  // exec input
  await promptHandle(options);
};

program
  .option('-n --name', 'please input config file name')
  .option('-y', 'Rapid deployment eslint, default options: vue + npm')
  .command('init')
  .description('eslint config init handle')
  .action(async () => {
    const options = program.opts();
    await run(options);
  });

program.parse(process.argv);
