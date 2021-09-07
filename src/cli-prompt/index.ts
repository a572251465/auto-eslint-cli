const prompts = require('prompts');
const cli = require('../cli/index.ts');

interface IPresets {
  title: string;
  value: string;
}

// eslint-disable-next-line consistent-return
const start = async (): Promise<any> => {
  const presetPrompt = {
    name: 'language',
    type: 'select',
    message: 'Please select the relevant language:',
    choices: [
      { title: 'vue', value: 'vue' },
      { title: 'react', value: 'react' }
    ] as { title: string; value: string }[]
  };
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
  const options = await prompts([presetPrompt, featurePrompt]);
  if (options.tool === 'cancel') {
    return Promise.reject(new Error('init close'));
  }
  await cli(options);
};

module.exports = start;
