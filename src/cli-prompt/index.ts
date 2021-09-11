const prompts = require('prompts');
const cli = require('../cli/index.ts');

interface IPresets {
  title: string;
  value: string;
}
interface IInitOptions {
  absolutePath: string;
}

// eslint-disable-next-line consistent-return
const start = async (params: IInitOptions): Promise<any> => {
  // 选择语言预设
  const presetPrompt = {
    name: 'language',
    type: 'select',
    message: 'Please select the relevant language:',
    choices: [
      { title: 'vue', value: 'vue' },
      { title: 'react', value: 'react' },
      { title: 'ts/js', value: 'ts/js' }
    ] as { title: string; value: string }[]
  };

  // 选择lint-staged文件后缀预设
  const featurePromptSuffix = {
    name: 'lintStagedSuffix',
    type: 'select',
    message: 'Please select the file < lint staged > suffix ',
    choices: (['.js', '.json'] as const).map((item) => ({ title: item, value: item }))
  };

  // 选择install 工具预设
  const features: IPresets[] = ['npm', 'yarn', 'cancel'].map((item) => ({
    title: item,
    value: item
  }));
  const featurePrompt = {
    name: 'tool',
    type: 'select',
    message: 'Please eslint init tool:',
    choices: features
  };

  console.log('If TS is selected, it may be just a gadget made with TS / JS');
  const presetsArr = [presetPrompt, featurePrompt];
  if (process.cwd() === params.absolutePath) {
    presetsArr.splice(1, 0, featurePromptSuffix);
  }
  const options = await prompts(presetsArr);
  if (options.tool === 'cancel') {
    return Promise.reject(new Error('init close'));
  }
  if (!options.lintStagedSuffix) {
    options.lintStagedSuffix = '.js';
  }
  await cli({ ...options, ...params });
};

module.exports = start;
