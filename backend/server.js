const { rejects } = require("assert");
const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const titles = [];

const { execSync, exec } = require("child_process");
const { init, hardlinkSub, uploadEpisode } = require("./hardlink");

const {
  linkImagesToPublic,
  getImagesFromFolder,
  upload,
  getImagesInPublic,
  alternativeTitle,
  getPosterInPublic,
  downloadImage,
  readImageNameInJson,
} = require("./photo");
const {
  getPathDirName,
  getVideoPath,
  makeVideoDir,
  deleteDir,
  makeDirPosterDir,
} = require("./video");
const { type } = require("os");

const imageGallery = [];
const videosPath = [];

const router = express.Router();

const port = 3000;

app.use(cors());

app.use(express.json()); //需要解析json才行

app.use("/public", express.static(path.join(__dirname, "public")));

function getDriveList() {
  if (process.platform === "win32") {
    const drivesOutput = execSync("wmic logicaldisk get name", {
      encoding: "utf-8",
    });
    const drives = drivesOutput
      .split("\r\r\n")
      .map((line) => line.trim())
      .filter((line) => /^[A-Z]:$/.test(line));
    return drives;
  } else {
    const drivesOutput = execSync("df -h", { encoding: "utf-8" });
    const drives = drivesOutput
      .split("\n")
      .map((line) => {
        const parts = line.split(/\s+/);
        return parts[parts.length - 1];
      })
      .filter((mountPoint) => mountPoint.startsWith("/"));
    return drives;
  }
}

//取磁盘路径
app.get("/drives", (req, res) => {
  const drives = getDriveList();
  res.json({ drives });
});

//过滤文件夹
app.get("/files", (req, res) => {
  const { path: clientPath } = req.query; // 从查询参数中获取 path

  if (!clientPath) {
    return res.status(400).json({ error: "Path parameter is required" });
  }

  fs.readdir(clientPath, (err, files) => {
    if (err) {
      console.error("Error scanning directory:", err);
      return res.status(500).json({ error: "Unable to scan directory" });
    }

    const dir = [];
    let pending = files.length;

    if (!pending) {
      return res.json({ dir }); // 如果没有文件，返回空数组
    }

    files.forEach((file) => {
      const filePath = path.join(clientPath, file);

      fs.stat(filePath, (err, stats) => {
        if (err) {
          if (err.code === "EPERM") {
            console.warn(`Permission denied: ${filePath}`);
          } else {
            console.error("Error getting file stats:", err);
          }
        } else if (stats.isDirectory()) {
          dir.push(file);
        }

        if (!--pending) {
          res.json({ dir });
        }
      });
    });
  });
});

app.post("/video", async (req, res) => {
  const { path, name, dirName } = req.query;

  if (!path) {
    return res.status(400).json({ error: "Path parameter is required" });
  }

  const files = await init(path, "E:/电影/hardlink", dirName, `/${name}`);

  videosPath.push(...files);

  return res.status(201).json({ success: "成功" });
});

app.get("/video", (req, res) => {
  try {
    if (videosPath.length !== 0) {
      return res.json(videosPath);
    }
  } catch (err) {
    console.log(err);
  } finally {
    videosPath.splice(0, videosPath.length);
  }
});

app.get("/dir/path", (req, res) => {
  const { dirPath } = req.query;

  const dirName = getPathDirName(dirPath);
  return res.json({ dirName: dirName });
});

app.post("/dir/path", (req, res) => {
  const { dirName, hardlinkPath, dirPosterPath } = req.body;

  makeVideoDir(hardlinkPath, dirName);
  makeDirPosterDir(dirName);
  linkImagesToPublic(dirPosterPath, dirName, "dir");
  return res.status(200).json({ success: "成功" });
});

app.delete("/dir/path", async (req, res) => {
  const { path } = req.query;

  try {
    await deleteDir(path);
    return res.status(200).json({ success: "成功" });
  } catch (error) {
    return res.status(500).json({ success: "失败", error: error.message });
  }
});

app.post("/dir/path", async (req, res) => {});

app.get("/video/path", (req, res) => {
  const { id, dirPath } = req.query;
  let data = [];

  try {
    data = getVideoPath(id, dirPath);
    return res.json({ data });
  } catch (error) {
    console.error("Error fetching video path:", error);
    return res.status(500).json({ error: "Failed to fetch video path" });
  }
});

app.get("/poster", async (req, res) => {
  const { name } = req.query;
  const data = await getPosterInPublic(name);
  res.status(200).json({ data });
});

app.post("/poster", async (req, res) => {
  const { name, imgPath } = req.query;

  makeVideoDir(`${__dirname}/public`, name);
  makeVideoDir(`${__dirname}/public/${name}`, "poster");
  await downloadImage(imgPath, `${__dirname}/public/${name}/poster/poster.jpg`);
  return res.status(200).json({ success: "成功" });
});

app.post("/upload/episode", async (req, res) => {
  const { sourcePath, hardlinkPath, hardlinkName, episodeStart } = req.body;
  const type = "movie";
  await uploadEpisode(
    sourcePath,
    hardlinkPath,
    hardlinkName,
    type,
    episodeStart
  );
  res.status(200).json({ success: "成功" });
});

app.get("/play", (req, res) => {
  const { playerPath, path } = req.query;
  exec(`"${playerPath}" "${path}"`, (err, stdout, stderr) => {
    if (err) {
      console.error(err);
      return;
    }
  });
});

app.post("/sub", async (req, res) => {
  const { path, id, subPath, episodeStart } = req.body;

  await hardlinkSub(path, id, subPath, episodeStart);
  return res.status(200).json({ success: "成功" });
});

// app.post("/uploadFolder", (req, res) => {
//   titles.push(...req.body.titles);

//   return res.status(200).json({ success: "成功" });
// });

app.post("/uploadFolder", upload.single("folder"), async (req, res) => {
  const { folderPath, name, dirName, id, hardlinkPath } = req.body;

  try {
    const alias = [];
    const imageFiles = getImagesFromFolder(folderPath);
    const videoNames = await readImageNameInJson(hardlinkPath, id, dirName);
    alias.push(...videoNames);
    alias.unshift(name);

    const images = linkImagesToPublic(imageFiles, alias);
    if (!images.length) {
      imageGallery.push(...getImagesInPublic(name));
    } else {
      imageGallery.push(...images);
    }
    titles.splice(0, titles.length);
    return res.json(imageGallery);
  } catch (error) {
    console.error("Error processing folder:", error);
    return res.status(500).json({ error: "Failed to process folder" });
  } finally {
    imageGallery.splice(0, imageGallery.length);
  }
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// 一个示例 API 端点，返回一些数据
app.get("/api/data", (req, res) => {
  const data = {
    message: "Hello from the API!",
    timestamp: new Date(),
  };
  res.json(data);
});

const server = app.listen(port, () => {
  console.log(`http://localhost:${3000}`);
});
