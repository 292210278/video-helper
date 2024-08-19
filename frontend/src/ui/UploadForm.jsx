import { useContext, useEffect, useState } from "react";
import SelectedDir from "../features/user-movies/SelectedDir";
import { useUploadEpisode } from "../features/video-detail/useCreateVideo";
import ConfigContext from "../contexts/ConfigContext";

function UploadForm({
  handleAddMovie,
  onCloseModal,
  path,
  id,
  type,
  name,
  videoType,
}) {
  const [data, setData] = useState([]);
  const [dirName, setDirName] = useState([]);
  // const [movieName, setMovieName] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [episode, setEpisode] = useState(1);
  const { mutate } = useUploadEpisode();
  const { videoPath } = useContext(ConfigContext);

  //取用户的磁盘路径
  useEffect(
    function () {
      async function fetchData() {
        try {
          const response = await fetch("http://localhost:3000/drives");
          const { drives } = await response.json();
          setData(drives);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
      if (currentIndex === 0) {
        fetchData();
      }
    },
    [currentIndex]
  );
  //取文件夹
  useEffect(() => {
    if (dirName.length === 0) return;
    let path = dirName.join("/");

    if (currentIndex === 1) path = path + "/";
    async function fetchData() {
      await getData(path);
    }
    if (currentIndex > 0) fetchData();
  }, [dirName, currentIndex]);

  //点击选择下一个文件夹
  function handleClick(dirName) {
    setDirName((preDirName) => {
      return [...preDirName, dirName];
    });
    setCurrentIndex((preIndex) => preIndex + 1);
  }

  function handleConfirm() {
    const subPath = dirName.join("/");
    // const subPathToEncode = encodeURIComponent(subPaths);
    handleAddMovie({ path, id, subPath, episode });

    onCloseModal();
  }

  function handleEpisodeConfirm() {
    const episodePath = dirName.join("/");

    const hardlinkPath = `${videoPath}\\${path}`;
    const hardlinkName = `\\${name}-${id}-${videoType}`;
    mutate({ episodePath, hardlinkPath, hardlinkName, episode });

    onCloseModal();
  }

  //点击返回选择上一文件夹
  function handlePreClick() {
    if (currentIndex > 0) {
      setCurrentIndex((preIndex) => preIndex - 1);
      setDirName((preDirName) => preDirName.slice(0, -1));
    }
  }

  //取文件夹下有什么文件的路径
  async function getData(path) {
    const encodedPath = encodeURIComponent(path);
    const response = await fetch(
      `http://localhost:3000/files?path=${encodedPath}`
    );
    const { dir } = await response.json();

    setData(dir);
  }

  if (type === "episode")
    return (
      <div className="selected-dir-container" id="selected-dir">
        <h2>选择起始集数</h2>
        <input
          className="selected-dir-input"
          placeholder="请输入影视名称"
          type="number"
          value={episode}
          onChange={(e) => setEpisode(e.target.value)}
        />
        <div className="selected-dir-box">
          {data?.length === 0
            ? null
            : data.map((item, index) => (
                <SelectedDir
                  handleClick={handleClick}
                  key={index} //设置独立的key，动画就会完好
                  item={item}
                />
              ))}
        </div>
        <div className="selected-handle">
          <div className="selected-path">{dirName.join("/")}</div>
          <button
            className="selected-pre selected-btn"
            onClick={handlePreClick}
          >
            返回
          </button>
          <button className="selected-btn" onClick={handleEpisodeConfirm}>
            确定
          </button>
        </div>
      </div>
    );

  return (
    <div className="selected-dir-container" id="selected-dir">
      <h2>字幕对应的集数</h2>
      <input
        className="selected-dir-input"
        placeholder="请输入影视名称"
        type="number"
        value={episode}
        onChange={(e) => setEpisode(e.target.value)}
      />
      <div className="selected-dir-box">
        {data?.length === 0
          ? null
          : data.map((item, index) => (
              <SelectedDir
                handleClick={handleClick}
                key={index} //设置独立的key，动画就会完好
                item={item}
              />
            ))}
      </div>
      <div className="selected-handle">
        <div className="selected-path">{dirName.join("/")}</div>
        <button className="selected-pre selected-btn" onClick={handlePreClick}>
          返回
        </button>
        <button className="selected-btn" onClick={handleConfirm}>
          确定
        </button>
      </div>
    </div>
  );
}

export default UploadForm;
