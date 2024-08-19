import { useSearchParams } from "react-router-dom";

import { useMovieDetail } from "../features/video-search/useVideoDetail";

import VideoDetailItem from "../features/video-detail/VideoDetailItem";

import { useGetVideo } from "../features/video-detail/useGetVideo";
import Transition from "../ui/Transition";
import VideoDetailNoNetItem from "../features/video-detail/VideoDetailNoNetItem";

const VIDEO_PATH = "E:\\电影\\hardlink\\";

function VideoDetail() {
  const [searchParams] = useSearchParams();
  // const location = useLocation();
  const id = searchParams.get("id");

  const type = searchParams.get("type");

  const dirName = searchParams.get("dirName");

  const { isLoading, movieDetail } = useMovieDetail(id, type);
  const path = dirName ? VIDEO_PATH + dirName : null;

  const { isGetting, video } = useGetVideo(id, path);

  if (!isGetting) console.log(video);

  return (
    <Transition>
      {isLoading || movieDetail.id === -1 ? (
        <Transition>
          <div className="box">
            <VideoDetailNoNetItem
              type={type}
              episodePath={video}
              id={id}
              dirName={dirName}
            />
          </div>
        </Transition>
      ) : (
        <Transition isLoading={isLoading} duration={0} isDetail={true}>
          <div className="box">
            <VideoDetailItem
              isLoading={isLoading}
              type={type}
              movieDetail={movieDetail}
              episodePath={video}
            />
          </div>
        </Transition>
      )}
    </Transition>
  );
}

export default VideoDetail;
