import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../../ui/Modal";
import UploadForm from "../../ui/UploadForm";
import { useUploadSub } from "./useCreateVideo";
import VideoDetailEpisode from "./VideoDetailEpisode";
import { getPoster } from "../../services/apiPhoto";

function VideoDetailNoNetItem({ dirName, episodePath, type, id }) {
  const [episode, setEpisode] = useState([]);
  const [nameNoNet, setNameNoNet] = useState("");
  const { mutate } = useUploadSub();
  const [poster, setPoster] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // 定义一个异步函数以获取海报数据
    async function fetchPoster() {
      try {
        const data = await getPoster(nameNoNet);
        setPoster(data.data);
      } catch (error) {
        console.error("Error fetching poster:", error);
        setPoster("");
      }
    }

    fetchPoster();
  }, [nameNoNet]);

  useEffect(
    function () {
      if (episodePath) {
        setEpisode(episodePath.data);
      }
    },
    [episodePath]
  );
  if (episode[0] && nameNoNet === "")
    setNameNoNet(episode[0].split("\\")[4].split("-")[0]);
  return (
    <div className="movie-detail-nonet_box">
      <h1> {nameNoNet}</h1>

      <img
        src={poster && poster?.[0] ? poster[0]?.imagePath : "/p1.jpg"}
        alt=""
        className="movie-detail-nonet_img"
      />
      <div className="operations">
        <h2
          onClick={() => {
            navigate(`/gallery?id=${id}&type=${type}&dirName=${dirName}`, {
              state: { nameNoNet },
            });
          }}
        >
          图库
        </h2>
        <Modal>
          <Modal.Open opens="sub">
            <h2>上传字幕</h2>
          </Modal.Open>
          <Modal.Window name="sub">
            <UploadForm handleAddMovie={mutate} path={dirName} id={id} />
          </Modal.Window>
        </Modal>
        <Modal>
          <Modal.Open opens="epi">
            <h2>上传剧集</h2>
          </Modal.Open>
          <Modal.Window name="epi">
            <UploadForm
              handleAddMovie={mutate}
              path={dirName}
              id={id}
              name={nameNoNet}
              type="episode"
              videoType={type}
            />
          </Modal.Window>
        </Modal>
      </div>

      <h3>剧集</h3>
      <ul className="video-detail-episodes">
        {episode?.length > 0
          ? episode.map((episode, index) => (
              <VideoDetailEpisode
                key={index}
                item={episode}
                index={index + 1}
              />
            ))
          : null}
      </ul>
    </div>
  );
}

export default VideoDetailNoNetItem;
