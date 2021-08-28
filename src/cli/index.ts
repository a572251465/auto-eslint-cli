const pathCli = require("path");
const fsCli = require("fs");
const chalkCli = require("chalk");
const defaultPresets = require("../cli-shared/presets.ts").default;
const { isDirExists, fileMove, isFileExists, assignPathWriteFile } =
  require("../cli-shared/fileUtils.ts").default;

const transformPresets: { [keyName: string]: string } = {
  "vue3&ts&vue-cli": "vue3 + ts/ vue-cli",
  "rollup&ts": "rollup + ts",
};

interface IEslintConfigInit {
  root: boolean;
  env: {
    node: boolean;
  };
  settings: {
    [keyName: string]: any;
  };
  extends: string[];
  parser: string;
  parserOptions: {
    parser: string;
  };
  rules: {
    [keyName: string]: string;
  };
}
type ITransform<T> = {
  [P in keyof T]?: T[P] extends object ? ITransform<T[P]> : T[P];
};
type IEslintConfig = ITransform<IEslintConfigInit>;

/**
 * @author lihh
 * @description 进行eslint配置
 */
const eslintConfigHandle = () => {
  const cwd = process.cwd();
  let oralEslintPath = null;
  const remarksName = [".eslintrc.js", ".eslintrc.json"];

  const dirList = fsCli.readdirSync(cwd);
  let i = 0;
  for (; i < dirList.length; i += 1) {
    const fileName = dirList[i];
    const tempPath = pathCli.resolve(cwd, fileName);
    if (
      !oralEslintPath &&
      remarksName.includes(fileName) &&
      isFileExists(tempPath)
    ) {
      oralEslintPath = tempPath;
      return;
    }
  }

  // 读取内容
  let eslintContent = null;
  if (oralEslintPath) {
    // eslint-disable-next-line import/no-dynamic-require
    eslintContent = require(oralEslintPath);
  } else {
    // eslint-disable-next-line import/no-dynamic-require
    eslintContent = require(pathCli.resolve(cwd, "package.json")).eslintConfig;
  }
  // if all eslint config not exist, create .eslintrc.js file
  eslintContent = {} as IEslintConfig;

  // package settings handle
  if (!eslintContent.settings || typeof eslintContent.settings !== "object") {
    eslintContent.settings = {};
  }
  const { settings } = eslintContent;
  if (!settings["import/resolver"]) {
    settings["import/resolver"] = {};
  }
  settings["import/resolver"] = {
    webpack: {
      config: "node_modules/@vue/cli-service/webpack.config.js",
    },
  };

  // package extends handle
  const extendEslint = Array.isArray(eslintContent.extends)
    ? eslintContent.extends
    : [];
  const extendPlugins: { name: string; toIndex: number; fromIndex?: number }[] =
    [
      { name: "airbnb-base", toIndex: 0 },
      {
        name: "prettier",
        toIndex: extendEslint.length === 0 ? 1 : extendEslint.length - 1,
      },
    ];
  if (extendEslint.length === 0) {
    extendEslint.push("airbnb-base");
    extendEslint.push("prettier");
  } else {
    extendPlugins.forEach(({ name }, key) => {
      const localIndex = extendEslint.indexOf(name);
      extendPlugins[key].fromIndex = localIndex;
    });
    extendPlugins.forEach((item) => {
      const { name, toIndex, fromIndex } = item;
      if (toIndex === fromIndex) {
        return;
      }
      extendEslint.splice(fromIndex!, 1);
      extendEslint.splice(toIndex, 0, name);
    });
  }
  eslintContent.extends = Object.assign([], extendEslint);
};

// cli 执行入口
const cliHandle = async (options: { preset: string; tool: string }) => {
  const cwd = process.cwd();
  const preset = transformPresets[options.preset];
  const packagePath = pathCli.resolve(cwd, "package.json");
  // eslint-disable-next-line import/no-dynamic-require
  const pkContent = require(packagePath);
  const { devDependencies = {}, dependencies = {} } = pkContent;

  // 设置执行的预设
  const execPresets: { plugin: string; version: string; env: string }[] = [];
  const plugins = defaultPresets[preset].plugins as {
    plugin: string;
    version: string;
    prefix: string;
  }[];
  plugins.forEach(({ plugin, version, prefix }) => {
    if (
      !devDependencies[plugin] ||
      !devDependencies[plugin].startsWith(prefix)
    ) {
      execPresets.push({ plugin, version, env: "devDependencies" });
      return;
    }
    if (!dependencies[plugin] || !dependencies[plugin].startsWith(prefix)) {
      execPresets.push({ plugin, version, env: "dependencies" });
    }
  });

  // husky文件处理
  const huskyPath: string = pathCli.resolve(cwd, ".husky");
  if (!isDirExists(huskyPath)) {
    const fromPath = pathCli.resolve(__dirname, "./cli-template", ".husky");
    await fileMove(fromPath, huskyPath);
  }

  // .eslintrc.js handle
  console.log(
    chalkCli.yellow(
      `warning: eslint config support the suffix is js json, and package.json`
    )
  );
  eslintConfigHandle();

  // commitlint.config.js handle
  const commitlintPath = pathCli.resolve(cwd, "commitlint.config.js");
  assignPathWriteFile(
    commitlintPath,
    `
    module.exports = { extends: ["@commitlint/config-angular"] };
  `
  );

  // package scripts and dependencies
  // eslint-disable-next-line import/no-dynamic-require
  const packageJson = require(packagePath);
  if (!packageJson.scripts) {
    packageJson.scripts = {};
  }
  packageJson.scripts = {
    ...packageJson.scripts,
    lint: "eslint --ext .js,.ts,.vue . && prettier --check .",
    "lint:fix": "eslint --fix --ext .js,.ts,.vue . && prettier --write .",
    prepare: "husky install",
  };
  execPresets.forEach((item) => {
    const { plugin, version, env } = item;
    if (!Reflect.has(packageJson, env)) {
      packageJson[env] = {};
    }
    packageJson[env][plugin] = version;
  });
  assignPathWriteFile(packagePath, packageJson);
};

module.exports = cliHandle;
