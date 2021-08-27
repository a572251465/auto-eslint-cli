const prompts = require("prompts");

const presets = require("./shared/presets.ts").default;

interface IPresets {
  title: string;
  value: string;
}

// eslint-disable-next-line consistent-return
const start = async (): Promise<any> => {
  // 设置预设进行选择
  const presetsList: IPresets[] = [];
  Object.keys(presets).forEach((preset) => {
    const { value } = presets[preset];
    presetsList.push({ title: preset, value });
  });
  const presetPrompt = {
    name: "preset",
    type: "select",
    message: "Please pick a preset:",
    choices: presetsList,
  };
  const features: IPresets[] = ["npm", "yarn", "cancel"].map((item) => ({
    title: item,
    value: item,
  }));
  const featurePrompt = {
    name: "tool",
    type: "select",
    message: "Please eslint init tool:",
    choices: features,
  };
  const options = await prompts([presetPrompt, featurePrompt]);
  if (options.tool === "cancel") {
    return Promise.reject(new Error("init close"));
  }
};

module.exports = start;
