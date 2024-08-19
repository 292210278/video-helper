const multer = require("multer");
const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

const OpenCC = require("opencc-js");
const { rejects } = require("assert");

const converter = OpenCC.Converter({ from: "cn", to: "hk" });

function makeVideoDir(path, dirName) {
  fs.ensureDir(path + "/" + dirName)
    .then(() => {
      console.log("成功创建");
    })
    .catch((err) => {
      console.log(err);
    });
}

function alternativeTitle(name, titles) {
  makeVideoDir(`${__dirname}/public`, name);
  const hkName = converter(name);
  titles.unshift(name);
  titles.push(hkName);

  return titles;
}

async function downloadImage(url, filePath) {
  try {
    const response = await axios({
      url,
      responseType: "stream",
    });

    response.data.pipe(fs.createWriteStream(filePath));

    response.data.on("end", () => {
      console.log(`Image saved to ${filePath}`);
    });
  } catch (error) {
    console.error("Error downloading the image:", error);
  }
}

function linkImagesToPublic(imageFiles, fileDirNames, type = "video") {
  const imagesPath = [];

  //创建文件夹
  if (type === "video") {
    imageFiles.forEach((filePath, index) => {
      const fileName = path.basename(filePath);
      let fileDirName = fileDirNames;
      const destPath = path.join(
        __dirname,
        `public/${fileDirName[0]}`,
        fileName
      );

      if (!fs.existsSync(destPath)) {
        // 目标文件不存在时才创建硬链接

        if (imagesFilterByName(fileName, fileDirName)) {
          fs.linkSync(filePath, destPath);
          imagesPath.push({
            imagePath: `http://localhost:3000/public/${fileDirName[0]}/${fileName}`,
            id: index,
          });
        }
      }
    });
  } else {
    const filePath = `${__dirname}/public/目录/${fileDirNames}/poster.png`;
    fs.linkSync(imageFiles, filePath);
    imagesPath.push({
      imagePath: `http://localhost:3000/public/目录/${fileDirNames}/poster.png`,
    });
  }
  return imagesPath;
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public"); // 临时存储上传的文件夹
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

function getImagesFromFolder(folderPath) {
  const imageFiles = [];

  const files = fs.readdirSync(folderPath);
  files.forEach((file) => {
    const filePath = path.join(folderPath, file);
    const stats = fs.statSync(filePath);

    if (!stats.isDirectory()) {
      imageFiles.push(filePath);
    }
  });

  return imageFiles;
}

function imagesFilterByName(filename, fileDirName) {
  const modifiedFilename = filename.replace(/\./g, " ");

  return fileDirName.some((dirName) => {
    const modifiedDirName = dirName.replace(/\./g, " ");
    if (modifiedFilename.includes(modifiedDirName)) return filename;
  });
}
// console.log(getImagesFromFolder("E:/电影播放器/PotPlayer/Capture"));

function getImagesInPublic(name) {
  const fileNames = fs.readdirSync(
    `${__dirname}/public/${name}`,
    function (err) {
      if (err) {
        console.log(err);
      }
    }
  );
  const imagesPath = [];

  fileNames.forEach((fileName, index) => {
    if (fileName === "poster") return;
    imagesPath.push({
      imagePath: `http://localhost:3000/public/${name}/${fileName}`,
      id: index,
    });
  });

  return imagesPath;
}

async function getPosterInPublic(name) {
  const fileNames = fs.readdirSync(
    `${__dirname}/public/${name}/poster`,
    function (err) {
      if (err) {
        console.log(err);
      }
    }
  );
  const imagesPath = [];

  fileNames.forEach((fileName, index) =>
    imagesPath.push({
      imagePath: `http://localhost:3000/public/${name}/poster/${fileName}`,
      id: index,
    })
  );

  return imagesPath;
}

async function readDir(path) {
  return new Promise((solve, rejects) => {
    fs.readdir(path, (err, files) => {
      if (err) console.log(err);
      solve(files);
    });
  });
}

async function readImageNameInJson(hardlinkPath, id, path) {
  const filesName = await readDir(`${hardlinkPath}\\${path}`);

  const fileName = filesName.filter((file) => file.includes(id));

  const jsonPath = `${hardlinkPath}\\${path}` + "\\" + fileName[0];

  const filesNameInVideo = await readDir(jsonPath);

  const jsonName = filesNameInVideo.filter((file) => file.includes(".json"));

  const readDataPath = jsonPath + "\\" + jsonName[0];
  const imageData = [];
  const data = await fs.readFile(readDataPath, "utf-8");

  // 读取文件内容
  // data.push(filesNameInVideo);
  const jsonData = JSON.parse(data); // 解析 JSON 数据
  imageData.push(...filesNameInVideo);
  imageData.push(...jsonData);

  return jsonData;
}

module.exports = {
  makeVideoDir,
  alternativeTitle,
  linkImagesToPublic,
  getImagesFromFolder,
  upload,
  getImagesInPublic,
  getPosterInPublic,
  downloadImage,
  readImageNameInJson,
};
