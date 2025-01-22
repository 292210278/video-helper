const { spawn } = require("child_process");
const fs = require("fs");

function videoSlice(name, videoPath) {
  const path = `./public/${name}/slice`; // 你要创建的文件夹路径
  const ffmpegCommand = "ffmpeg";
  const ffmpegArgs = [
    "-i",
    `${videoPath}`,
    "-c:v",
    "h264_nvenc",
    "-pix_fmt",
    "yuv420p",
    "-b:v",
    "5M",
    "-preset",
    "p4",
    "-c:a",
    "aac",
    "-b:a",
    "128k",
    "-f",
    "hls",
    "-hls_time",
    "20",
    "-hls_list_size",
    "0",
    "-hls_segment_filename",
    `${path}/segment_%03d.ts`,
    "-hls_flags",
    "append_list",
    `${path}/output.m3u8`,
  ];
  try {
    fs.mkdirSync(path, { recursive: true }); // 如果文件夹已经存在，recursive 会防止报错
    console.log("文件夹创建成功");
  } catch (err) {
    console.error("创建文件夹失败:", err);
  }

  const ffmpeg = spawn(ffmpegCommand, ffmpegArgs);

  return new Promise((resolve, rejects) => {
    let isFin = false;
    ffmpeg.on("close", (code) => {
      if (code === 0) {
        isFin = true;
        resolve(isFin);
      } else {
        resolve(isFin);
      }
    });
  });
}

module.exports = { videoSlice };
