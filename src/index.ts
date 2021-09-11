const chalk = require('chalk');
const { program } = require('commander');
const path = require('path');
const { fs } = require('node-extra');
const ProgressBar = require('progress');

const packageError = 'Error: file package.json does not exist, init fail';
const cwd = process.cwd();
const defaultOptions = {
  language: 'vue',
  tool: 'npm',
  lintStagedSuffix: '.json'
};

interface IInitOptions {
  y: boolean;
  absolutePath: string;
}

// eslint-disable-next-line consistent-return,no-async-promise-executor
const promptHandle = (options: IInitOptions) =>
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

        const selectOptions = { absolutePath: options.absolutePath };
        if (options.y) {
          require('./cli/index.ts')({ ...defaultOptions, ...selectOptions });
        } else {
          require('./cli-prompt/index.ts')(selectOptions);
        }
        resolve(true);
      }
    }, 50);
  });

// eslint-disable-next-line consistent-return
const run = async (options: IInitOptions) => {
  const packagePath = path.resolve(options.absolutePath, 'package.json');
  const isPackageExist = fs.isFileExists(packagePath);
  if (!isPackageExist) {
    console.error(chalk.red(packageError));
    process.exit(1);
    return;
  }

  const gitPath = path.resolve(cwd, '.git');
  const isGitExist = fs.isDirExists(gitPath);
  if (!isGitExist) {
    console.error(chalk.red(".git can't be found"));
    console.error(chalk.red(`please run command <${chalk.yellow('git init')}>`));
    process.exit(1);
    return;
  }

  // exec input
  await promptHandle(options);
};

program
  .option('-y', 'Rapid deployment eslint, default options: vue + npm')
  .command('init')
  .description('eslint config init handle')
  .action(async () => {
    console.log(chalk.yellow('The current cli must run in the project root dir!!!!!!!!'));
    const options = program.opts() as IInitOptions;
    // 如果绝对路径没有 直接赋值为运行目录
    if (!options.absolutePath) {
      options.absolutePath = process.cwd();
    } else {
      const transformPath: string = path.resolve(options.absolutePath);
      if (!transformPath.includes(cwd)) {
        console.log(chalk.red(`-ap The path must contain at least <${options.absolutePath}> `));
        process.exit(1);
      }
      options.absolutePath = transformPath;
    }

    if (typeof options.y === 'undefined') {
      options.y = false;
    }
    await run(options);
  });

program.parse(process.argv);
