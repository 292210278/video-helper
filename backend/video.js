const fs = require("fs-extra");
const path = require("path");

function makeVideoDir(path, dirName) {
  if (fs.existsSync(`${path}/${dirName}`)) return;
  fs.ensureDir(path + "/" + dirName)
    .then(() => {
      console.log("创建成功");
    })
    .catch((err) => {
      console.log(err);
    });
}

function makeDirPosterDir(dirName) {
  if (fs.existsSync(`${__dirname}/public/目录/${dirName}`)) return;
  fs.ensureDir(`${__dirname}/public/目录` + "/" + dirName)
    .then(() => {
      console.log("创建成功");
    })
    .catch((err) => {
      console.log(err);
    });
}

async function deleteDir(path) {
  fs.remove(path)
    .then(() => {
      console.log(`Directory at ${path} has been removed successfully.`);
    })
    .catch((err) => {
      console.error(`Error while removing directory at ${path}:`, err);
    });
}

function getPathDirName(targetDir) {
  // 目标目录
  // const targetDir = "E:\\电影\\hardlink";

  // 递归获取所有文件夹并构建层级结构
  function getFoldersHierarchy(dir, parent = null) {
    const hierarchy = [];
    if (dir === "") return hierarchy;
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        hierarchy.push({
          videoName: file.split("-")[0],
          path: fullPath,
          name: file,
          parent: parent,
          children: getFoldersHierarchy(fullPath, fullPath),
        });
      }
    });

    return hierarchy;
  }

  const foldersHierarchy = getFoldersHierarchy(targetDir);
  return foldersHierarchy;
}

function getVideoPath(searchString, targetDir) {
  const filesFromMatchingFolders = getFilesFromMatchingFolders(
    targetDir,
    searchString
  );
  return filesFromMatchingFolders;
}

function getFilesFromMatchingFolders(baseDir, searchString) {
  //取到给的路径下的文件夹
  const directories = getDirectories(baseDir);

  // 过滤包含指定字符串的文件夹
  const matchingDirectories = directories.filter((dir) =>
    dir.includes(searchString)
  );
  const result = [];
  if (!matchingDirectories) return result;

  matchingDirectories.forEach((dir) => {
    const folderPath = path.join(baseDir, dir);

    const files = getDirectories(folderPath);

    files.forEach((file) => {
      let filePath = path.join(folderPath, file);
      if (
        path.extname(file).toLowerCase() === ".mkv" ||
        path.extname(file).toLowerCase() === ".mp4"
      )
        result.push(filePath);
    });
  });

  result.sort(naturalCompare);

  return result;
}

//排序
function naturalCompare(a, b) {
  const aParts = a.match(/\d+|\D+/g);
  const bParts = b.match(/\d+|\D+/g);

  for (let i = 0; i < Math.min(aParts.length, bParts.length); i++) {
    const aPart = aParts[i];
    const bPart = bParts[i];
    const aNum = parseInt(aPart, 10);
    const bNum = parseInt(bPart, 10);

    if (!isNaN(aNum) && !isNaN(bNum)) {
      if (aNum !== bNum) {
        return aNum - bNum;
      }
    } else if (aPart !== bPart) {
      return aPart.localeCompare(bPart);
    }
  }

  return aParts.length - bParts.length;
}

function getFilesInDirectory(dir) {
  return fs.map((item) => path.join(dir, item.name));
}

function getDirectories(dir) {
  return fs
    .readdirSync(dir, { withFileTypes: true })

    .map((item) => item.name);
}

// makeVideoDir("E:/video-player", "hi");
module.exports = {
  makeDirPosterDir,
  getPathDirName,
  getVideoPath,
  makeVideoDir,
  deleteDir,
};
