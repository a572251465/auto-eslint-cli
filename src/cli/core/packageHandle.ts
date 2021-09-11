const path = require('path');
const { fs: fsUtils } = require('node-extra');
const fs = require('fs');

type IExecPresets = { plugin: string; version: string; env: string }[];
interface ILanguageType {
  // vue2版本生成
  vue2: boolean;
  // vue3版本生成
  vue3: boolean;
  // react生成
  react: boolean;
  // rollup cli
  rollupCli: boolean;
}

interface IPackageOptions {
  execPresets: IExecPresets;
  judgeLanguage: ILanguageType;
  lintStagedSuffix: string;
  absolutePath: string;
  surplusPath: string;
}
const packageHandle = (params: IPackageOptions) => {
  const { execPresets, judgeLanguage, lintStagedSuffix, absolutePath } = params;
  // eslint-disable-next-line import/no-dynamic-require
  const packagePath = path.resolve(params.absolutePath, 'package.json');
  const packageJson = require(packagePath);
  if (!packageJson.scripts) {
    packageJson.scripts = {};
  }
  packageJson.scripts = {
    ...packageJson.scripts,
    lint: 'eslint --ext .js,.ts,.vue . && prettier --check .',
    'lint:fix': 'eslint --fix --ext .js,.ts,.vue . && prettier --write .'
  };
  execPresets.forEach((item) => {
    const { plugin, version, env } = item;
    if (!Reflect.has(packageJson, env)) {
      packageJson[env] = {};
    }
    packageJson[env][plugin] = version;
  });

  const dirNames = fs.readdirSync(absolutePath);
  const isLerna = dirNames.includes('lerna.json');
  const pathKey = isLerna ? 'packages' : 'src';
  const suffixArr: string[] = ['js', 'ts'];
  if (judgeLanguage.vue2 || judgeLanguage.vue3) {
    suffixArr.push('vue');
  }
  if (judgeLanguage.react) {
    suffixArr.push('jsx', 'tsx');
  }
  const suffixKey = `{${suffixArr.join(',')}}`;

  // package setting init-staged
  if (lintStagedSuffix === '.json') {
    packageJson['lint-staged'] = {
      [`${pathKey}/**/*.${suffixKey}`]: ['yarn lint']
    };
  } else {
    const content = require(path.resolve(__dirname, './cli-template/lintstagedrc.js'))({
      suffixKey,
      surplusPath: params.surplusPath
    });
    fsUtils.wContent(path.resolve(absolutePath, '.lintstagedrc.js'), content);
  }
  fsUtils.wContent(packagePath, packageJson);
};

export default packageHandle;
