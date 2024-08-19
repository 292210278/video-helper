const fs = require("fs");
const multer = require("multer");
const path = require("path");

function getImagesFromFolder(folderPath) {
  const imageFiles = [];

  const files = fs.readdirSync(folderPath);
  files.forEach((file) => {
    const filePath = path.join(folderPath, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      imageFiles.push(...getImagesFromFolder(filePath));
    } else if (isImageFile(file)) {
      imageFiles.push({
        fileName: file,
        filePath: filePath,
      });
    }
  });

  return imageFiles;
}

function isImageFile(fileName) {
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif"];
  const ext = path.extname(fileName).toLowerCase();
  return imageExtensions.includes(ext);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public"); // 上传临时存储目录
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });
module.exports = {
  getImagesFromFolder,
};
