#! /usr/bin/env node
const chalk = require("chalk");
const { program } = require("commander");
const path = require("path");
const fs = require("fs");

const packageError = "Error: file package.json does not exist, init fail";
const cwd = process.cwd();

// eslint-disable-next-line consistent-return
const promptHandle = async () => {
  require("../dist/index")(cwd);
};

// eslint-disable-next-line consistent-return
const run = () => {
  const packagePath = path.resolve(cwd, "package.json");
  let stat = null;
  try {
    stat = fs.statSync(packagePath);
    if (!stat.isFile()) {
      console.error(chalk.red(packageError));
      return false;
    }

    // exec input
    promptHandle();
  } catch (e) {
    console.error(chalk.red(packageError));
  }
};

program
  .option("-n --name", "please input config file name")
  .command("init")
  .description("eslint config init handle")
  .action(() => {
    run();
  });

program.parse(process.argv);
