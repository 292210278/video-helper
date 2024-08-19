import { useNavigate, useSearchParams } from "react-router-dom";
import Modal from "../../ui/Modal";

import VideoDetailEpisode from "./VideoDetailEpisode";
import UploadForm from "../../ui/UploadForm";
import { useUploadSub } from "./useCreateVideo";
import { useEffect, useState } from "react";
// import { getPoster } from "../../services/apiPhoto";
// import { useContext, useEffect, useState } from "react";
// import SearchContext from "../../contexts/SearchContext";

function VideoDetailItem({ movieDetail, episodePath, type }) {
  // const { videos } = useContext(SearchContext);
  // const episode = episodePath ? episodePath.data : [];
  const [episode, setEpisode] = useState([]);
  const { mutate } = useUploadSub();
  const [searchParams] = useSearchParams();
  // const [nameNoNet, setNameNoNet] = useState("");

  const dirName = searchParams.get("dirName");

  const navigate = useNavigate();
  const {
    id,
    vote_average,
    name,
    title,
    poster_path,
    genres,
    overview,
    original_name,
    last_air_date,
    created_by,
  } = movieDetail;

  useEffect(
    function () {
      if (episodePath) {
        setEpisode(episodePath.data);
      }
    },
    [episodePath]
  );
  const nameByUser = name ? name : title;

  const img = `	https://media.themoviedb.org/t/p/w300_and_h450_bestv2${poster_path}`;

  if (movieDetail.id === -1) {
    return null;
  }

  return (
    <Modal>
      <div className="box">
        <div className="video-detail_container">
          <div className="video-detail">
            <header className="video-detail_header">
              <h2>{nameByUser}</h2>
            </header>
            <main className="video-detail_main">
              <div className="video-detail_photo">
                <img src={img} alt="" />
              </div>
              <div className="video-detail_text">
                <div className="video-detail_text_row">
                  <h4>原名：</h4>
                  <span>{original_name}</span>
                </div>
                <div className="video-detail_text_row">
                  <h4>评分：</h4>
                  <span>{vote_average}</span>
                </div>
                <div className="video-detail_text_row">
                  <h4>主演：</h4>
                  <span>{created_by?.[0]?.name || ""}</span>
                </div>
                <div className="video-detail_text_row">
                  <h4>类型：</h4>
                  <span className="video-detail_genres">
                    {genres.map((genre, index) => (
                      <div key={index}>{genre.name}</div>
                    ))}
                  </span>
                </div>
                <div className="video-detail_text_row">
                  <h4 className="mr">上映时间: </h4>
                  <span> {last_air_date}</span>
                </div>

                <h3>简介</h3>
                <p className="video-detail_overview">{overview}</p>
                <div>
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
                <div className="operations">
                  <h2
                    onClick={() => {
                      navigate(
                        `/gallery?id=${id}&type=${type}&dirName=${dirName}`,
                        {
                          state: { original_name, nameByUser },
                        }
                      );
                    }}
                  >
                    图库
                  </h2>
                  <Modal>
                    <Modal.Open opens="sub">
                      <h2>上传字幕</h2>
                    </Modal.Open>
                    <Modal.Window name="sub">
                      <UploadForm
                        handleAddMovie={mutate}
                        path={dirName}
                        id={id}
                      />
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
                        name={nameByUser}
                        type="episode"
                        videoType={type}
                      />
                    </Modal.Window>
                  </Modal>
                </div>
              </div>
            </main>
          </div>
        </div>

        <Modal.Window name="gallery" type="img">
          <img alt="" className="scale" />
        </Modal.Window>
      </div>
    </Modal>
  );
}

export default VideoDetailItem;
