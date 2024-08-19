import { createContext, useEffect, useState } from "react";
export const PICTURE = "E:\\电影播放器\\PotPlayer\\Capture";
export const VIDEO_PATH = "E:\\电影\\hardlink";
const ConfigContext = createContext();

export function ConfigProvider({ children }) {
  const [picturePath, setPicturePath] = useState(
    localStorage.getItem("picture-path")
      ? localStorage.getItem("picture-path")
      : ""
  );
  const [videoPath, setVideoPath] = useState(
    localStorage.getItem("video-path") ? localStorage.getItem("video-path") : ""
  );
  const [playerPath, setPlayerPath] = useState(
    localStorage.getItem("player-path")
      ? localStorage.getItem("player-path")
      : ""
  );

  useEffect(() => {
    // 从localStorage获取数据

    const picturePath = localStorage.getItem("picture-path");
    if (picturePath) {
      setPicturePath(picturePath);
    }
    const videoPath = localStorage.getItem("video-path");

    if (videoPath) {
      setVideoPath(videoPath);
    }
    const playerPath = localStorage.getItem("player-path");
    if (playerPath) {
      setPlayerPath(playerPath);
    }
  }, [picturePath, videoPath, playerPath]);

  return (
    <ConfigContext.Provider
      value={{
        picturePath,
        setPicturePath,
        videoPath,
        setVideoPath,
        playerPath,
        setPlayerPath,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
}

export default ConfigContext;
