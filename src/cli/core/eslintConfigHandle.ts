const fs = require('fs');
const { fs: fsUtils } = require('node-extra');
const path = require('path');
const chalk = require('chalk');

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
interface IOptions {
  importResolver: boolean;
  absolutePath: string;
}

const eslintConfigHandle = (option: IOptions) => {
  const cwd = option.absolutePath;
  let oralEslintPath = null;
  const remarksName = ['.eslintrc.js', '.eslintrc.json'];

  const dirList = fs.readdirSync(cwd);
  let i = 0;
  for (; i < dirList.length; i += 1) {
    const fileName = dirList[i];
    const tempPath = path.resolve(cwd, fileName);
    if (!oralEslintPath && remarksName.includes(fileName) && fsUtils.isFileExists(tempPath)) {
      oralEslintPath = tempPath;
    }
  }

  // 读取内容
  let eslintContent = null;
  if (oralEslintPath) {
    // eslint-disable-next-line import/no-dynamic-require
    eslintContent = require(oralEslintPath);
  } else {
    // eslint-disable-next-line import/no-dynamic-require
    eslintContent = require(path.resolve(cwd, 'package.json')).eslintConfig;
  }
  const allNotExist = !eslintContent;
  // if all eslint config not exist, create .eslintrc.js file
  if (allNotExist) {
    eslintContent = {} as IEslintConfig;
  }

  // package settings handle
  if (option?.importResolver) {
    if (!eslintContent.settings || typeof eslintContent.settings !== 'object') {
      eslintContent.settings = {};
    }
    const { settings } = eslintContent;
    if (!settings['import/resolver']) {
      settings['import/resolver'] = {};
    }
    settings['import/resolver'] = {
      webpack: {
        config: 'node_modules/@vue/cli-service/webpack.config.js'
      }
    };
  }

  // package extends handle
  const extendEslint = Array.isArray(eslintContent.extends) ? eslintContent.extends : [];
  const extendPlugins: { name: string; toIndex: number; fromIndex?: number }[] = [
    { name: 'airbnb-base', toIndex: 0 },
    {
      name: 'prettier',
      toIndex: extendEslint.length === 0 ? 1 : extendEslint.length + 1
    }
  ];
  if (extendEslint.length === 0) {
    extendEslint.push('airbnb-base');
    extendEslint.push('prettier');
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
      if (fromIndex !== -1) {
        extendEslint.splice(fromIndex!, 1);
      }
      extendEslint.splice(toIndex, 0, name);
    });
  }
  const localIndex = extendEslint.indexOf('eslint:recommended');
  if (localIndex !== -1) {
    extendEslint.splice(localIndex, 1);
  }
  eslintContent.extends = Object.assign([], extendEslint);

  if (allNotExist) {
    fsUtils.wContent(path.resolve(cwd, '.eslintrc.json'), eslintContent);
  }

  // content write
  if (oralEslintPath) {
    if (oralEslintPath.endsWith('.json')) {
      fsUtils.wContent(oralEslintPath, eslintContent);
    } else {
      const content = `module.exports = ${JSON.stringify(eslintContent, null, 2)}
      `;
      fsUtils.wContent(oralEslintPath, content, 0);
    }
  }

  // eslintignore
  const fromPath = path.resolve(__dirname, './cli-template/ignore', '.eslintignore');
  fs.copyFileSync(fromPath, path.resolve(cwd, '.eslintignore'));

  console.log(chalk.yellow(`warning: eslint config support the suffix is js json, and package.json`));
};

export default eslintConfigHandle;
