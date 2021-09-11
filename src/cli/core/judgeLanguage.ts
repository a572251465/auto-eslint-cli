const path = require('path');

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
const judgeLanguage = (absolutePath: string): ILanguageType => {
  const languageTypes: ILanguageType = {
    vue2: false,
    vue3: false,
    react: false,
    rollupCli: false
  };
  const packagePath = path.resolve(absolutePath, 'package.json');
  const { dependencies = {}, devDependencies = {} } = require(packagePath);
  if (dependencies.vue || devDependencies.vue) {
    const edition = dependencies.vue || devDependencies.vue;
    languageTypes[edition.startsWith('^3') || edition.startsWith('3') ? 'vue3' : 'vue2'] = true;
    return languageTypes;
  }

  if (dependencies.react || devDependencies.react) {
    languageTypes.react = true;
    return languageTypes;
  }

  languageTypes.rollupCli = true;
  return languageTypes;
};

export default judgeLanguage;
