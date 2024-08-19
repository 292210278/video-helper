const { rejects } = require("assert");
const fs = require("fs");
const fsExtra = require("fs-extra");
const path = require("path");

function makeDir(path, name) {
  fs.mkdir(`${path}/${name}`, (err) => {
    if (err) console.log(err);
    console.log("success");
  });
}

async function readDir(sourcePath, type) {
  return new Promise((solve, reject) => {
    if (sourcePath === "") return reject("路径不能为空");

    fs.readdir(sourcePath, (err, flies) => {
      if (err) return reject(err);

      const filterFlies =
        type === "movie" ? filterMovie(flies) : filterSub(flies);

      const fliesPath = filterFlies.map(
        (file) => (file = sourcePath + `\\${file}`)
      );

      solve(fliesPath);
    });
  });
}

function filterMovie(arr) {
  return arr.filter((file) => [".mkv", ".mp4"].includes(path.extname(file)));
}

function filterSub(arr) {
  return arr.filter((file) => [".ass", ".srt"].includes(path.extname(file)));
}

async function createHardLink(src, dest) {
  return new Promise((resolve, reject) => {
    fs.link(src, dest, (err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
}

async function hardLink(
  arr,
  hardLinkPath,
  hardLinkName,
  type = "movie",
  episodeStart = 1
) {
  const destFile = [];

  for (let i = 0; i < arr.length; i++) {
    const filePath = arr[i];

    const extname = path.extname(filePath);
    const destPath =
      type === "movie"
        ? hardLinkPath +
          `${hardLinkName}` +
          `${hardLinkName}_${episodeStart}${extname}`
        : hardLinkPath + `${hardLinkName}_${episodeStart}${extname}`;
    episodeStart++;

    try {
      if (!fs.existsSync(destPath)) {
        await createHardLink(filePath, destPath);
        destFile.push(destPath);
      }
    } catch (err) {
      console.error(`创建硬链接失败: ${filePath} -> ${destPath}`, err);
    }
  }
  return destFile;
}

async function uploadEpisode(
  sourcePath,
  hardLinkPath,
  hardLinkName,
  type = "movie",
  episodeStart
) {
  const filesInSourcePath = await readDir(sourcePath, type);
  const data = await fsExtra.readFile(
    `${hardLinkPath}${hardLinkName}${hardLinkName}.json`,
    "utf-8"
  );
  const dataJson = JSON.parse(data);

  filesInSourcePath.forEach((file) => {
    dataJson.push(path.basename(file));
  });
  const jsonFilesName = JSON.stringify(dataJson, null, 2);
  fs.writeFileSync(
    `${hardLinkPath}${hardLinkName}${hardLinkName}.json`,
    jsonFilesName,
    (err) => {
      if (err) {
        console.log("失败");
        return err;
      }
    }
  );
  hardLink(filesInSourcePath, hardLinkPath, hardLinkName, type, episodeStart);
}

async function init(
  sourcePath,
  hardLinkPath,
  dirPath,
  hardLinkName,
  type = "movie"
) {
  try {
    const filePathArr = await readDir(sourcePath, type);

    let destFile = [];
    hardLinkPath = `${hardLinkPath}/${dirPath}`;

    if (!fs.existsSync(`${hardLinkPath}/${hardLinkName}`)) {
      makeDir(hardLinkPath, hardLinkName);
    }

    if (filePathArr.length === 0) {
      throw new Error("找不到  文件");
    }

    if (fs.existsSync(hardLinkPath)) {
      const filesName = filePathArr.map((file) => path.basename(file));
      const jsonFilesName = JSON.stringify(filesName, null, 2);
      fs.writeFileSync(
        `${hardLinkPath}${hardLinkName}${hardLinkName}.json`,
        jsonFilesName,
        "utf-8",
        (err) => {
          if (err) {
            console.log("没写进去");

            console.log(err);
            return;
          }
          console.log("json成功");
        }
      );

      destFile = await hardLink(filePathArr, hardLinkPath, hardLinkName);
    }

    return destFile ? destFile : [];
  } catch (err) {
    console.error(err);
  }
}

async function readDirSub(path) {
  return new Promise((solve, rejects) => {
    fs.readdir(path, (err, files) => {
      if (err) console.log(err);
      solve(files);
    });
  });
}

async function hardlinkSub(path, id, subPath) {
  const filesName = await readDirSub(`E:\\电影\\hardlink\\${path}`);

  const fileName = filesName.filter((file) => file.includes(id));

  const linkPath = `E:\\电影\\hardlink\\${path}` + "\\" + fileName[0] + "\\";

  const subsPath = await readDir(subPath, "sub");

  hardLink(subsPath, linkPath, fileName[0], "sub");
}

module.exports = {
  init,
  hardlinkSub,
  uploadEpisode,
};
