#! /usr/bin/env node
const chalk = require("chalk");
const path = require("path");
const fs = require("fs");

const packageError = "Error: file package.json does not exist, init fail";

const cwd = process.cwd();
const packagePath = path.resolve(cwd, "package.json");
let stat = null;
try {
  stat = fs.statSync(packagePath);
  if (!stat.isFile()) {
    console.error(chalk.red(packageError));
  }
} catch (e) {
  console.error(chalk.red(packageError));
}
