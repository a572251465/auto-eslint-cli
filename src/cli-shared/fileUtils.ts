const fs = require("fs");

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
 * @description 进行文件移动
 * @param fromPath 来自的文件
 * @param toPath 去向的文件
 */
const fileMove = (fromPath: string, toPath: string): boolean => {
  try {
    const readStream = fs.createReadStream(fromPath);
    const writeStream = fs.createWriteStream(toPath);
    readStream.pipe(writeStream);
    return true;
  } catch (e) {
    return false;
  }
};

export default {
  isFileExists,
  isDirExists,
  assignPathWriteFile,
  fileMove,
};
