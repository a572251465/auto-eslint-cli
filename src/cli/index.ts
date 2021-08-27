const path = require("path");
const defaultPresets = require("../cli-shared/presets.ts").default;
const { isDirExists, fileMove } = require("../cli-shared/fileUtils.ts").default;

// cli 执行入口
const cli = (options: { preset: string; tool: string }) => {
  const cwd = process.cwd();
  const { preset, tool } = options;
  const packagePath = path.resolve(cwd, "package.json");
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
      execPresets.push({ plugin, version, env: "-D" });
      return;
    }
    if (!dependencies[plugin] || !dependencies[plugin].startsWith(prefix)) {
      execPresets.push({ plugin, version, env: "-S" });
    }
  });

  // husky文件处理
  const huskyPath: string = path.resolve(cwd, ".husky");
  if (!isDirExists(huskyPath)) {
    const fromPath = path.resolve(__dirname, "../cli-template", ".husky");
    fileMove(fromPath, huskyPath);
  }

  // .eslintrc.js 处理
  console.log(tool);
  // TODO
};

export default cli;
