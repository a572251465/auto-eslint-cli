const cp = require("child_process");

// 直接执行命令
// eslint-disable-next-line arrow-body-style
const runCommand = (
  command: string,
  args: string[],
  options: object
): Promise<void> =>
  new Promise((resolve, reject) => {
    const executedCommand = cp.spawn(command, args, {
      stdio: "inherit",
      shell: true,
      ...options,
    });

    // fail
    executedCommand.on("error", (error: string | undefined) => {
      reject(new Error(error));
    });

    // success
    executedCommand.on("exit", (code: number) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(""));
      }
    });
  });

export default runCommand;
