const fs = require("fs");
const path = require("path");

/**
 * @author lihh
 * @description 判断文件是否存在
 * @param {*} filePath 文件路径
 */
const isFileExists = (filePath: string): boolean => {
  try {
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      return false;
    }
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * @author lihh
 * @description 判断是否是目录
 * @param {*} dirPath
 * @returns
 */
const isDirExists = (dirPath: string): boolean => {
  try {
    const stats = fs.statSync(dirPath);
    if (stats.isFile()) {
      return false;
    }
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * @author lihh
 * @description 指定文件写入内容
 * @param {*} dir
 * @param {*} content
 */
const assignPathWriteFile = (dir: string, content: string | object) => {
  const stream = fs.createWriteStream(dir);
  stream.write(
    typeof content === "string" ? content : JSON.stringify(content, null, 2)
  );
  stream.close();
};

/**
 * @author lihh
 * @description 删除文件 可以是目录 || 具体文件
 * @param dir 表示删除目录
 */
const removeFile = (dir: string): Promise<boolean> =>
  new Promise((resolve, reject) => {
    // eslint-disable-next-line consistent-return
    const run = (dirs: string[]) => {
      try {
        let i = 0;
        for (; i < dirs.length; i += 1) {
          const name = dirs[i];
          const status = isFileExists(name);
          if (status) {
            fs.unlinkSync(name);
            return;
          }
          const dirList = fs.readdirSync(name);
          if (dirList.length === 0) {
            fs.rmdirSync(name);
            return;
          }

          const newDir = dirList.map((filename: string) =>
            path.resolve(name, filename)
          );
          run(newDir);
          fs.rmdirSync(name);
        }
      } catch (e) {
        console.log(e);
        reject();
      }
    };
    run([dir]);
    resolve(true);
  });

/**
 * @author lihh
 * @description 进行文件移动
 * @param fromPath 来自的文件
 * @param toPath 去向的文件
 */
const fileMove = (fromPath: string, toPath: string): Promise<boolean> =>
  // eslint-disable-next-line no-async-promise-executor
  new Promise(async (resolve, reject) => {
    try {
      if (isDirExists(toPath)) {
        await removeFile(toPath);
      }
      fs.mkdirSync(toPath);

      const run = (targetPath: string, suffix?: string) => {
        const dirList = fs.readdirSync(targetPath);
        if (dirList.length === 0) {
          return;
        }
        let i = 0;
        for (; i < dirList.length; i += 1) {
          const newPath = path.resolve(targetPath, dirList[i]);
          const stat = fs.statSync(newPath);
          const toNewPath = suffix
            ? path.resolve(toPath, suffix, dirList[i])
            : path.resolve(toPath, dirList[i]);
          if (stat.isDirectory()) {
            if (!isDirExists(toNewPath)) {
              fs.mkdirSync(toNewPath);
            }
            run(newPath, dirList[i]);
          }
          if (stat.isFile()) {
            fs.copyFileSync(newPath, toNewPath);
          }
        }
      };
      run(fromPath);
      resolve(true);
    } catch (e) {
      console.log(e);
      reject(new Error(""));
    }
  });
export default {
  isFileExists,
  isDirExists,
  assignPathWriteFile,
  fileMove,
  removeFile,
};
