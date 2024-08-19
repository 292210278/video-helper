import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import SearchContext from "../../contexts/SearchContext";
import { useCreateVideo } from "../video-detail/useCreateVideo";
import { useDownLoadPoster } from "../gallery/useDownLoadPoster";

function SearchResultItems({ movieItem, handleCancel, type }) {
  const navigate = useNavigate();
  const { poster_path, title, id, name } = movieItem;
  const { videos, setVideos } = useContext(SearchContext);

  const videoData = videos.length > 0 ? videos[0].movies[0] : null;
  let path = videoData ? videoData.path : "";
  if (path) path = encodeURIComponent(path);
  const dirName = videoData ? videos[0].dirName : "";
  const videoName = title ? title : name;

  // 始终调用 useCreateVideo，但根据路径的值来判断是否要执行 mutate
  const { mutate } = useCreateVideo(path, videoName, id, type, dirName);

  const { mutate: mutatePosterFn } = useDownLoadPoster();

  const poster = `https://media.themoviedb.org/t/p/w300_and_h450_bestv2${poster_path}`;

  const handleClick = () => {
    if (videos.length > 0) {
      mutate();

      mutatePosterFn({ name: videoName, url: poster });
      setVideos([]);
    }

    navigate(`/video-detail?id=${id}&type=${type}&dirName=${dirName}`, {
      // 如果有状态需要传递可以解开下面的注释
      // state: {
      //   path: path,
      //   name: videoName,
      // },
    });

    handleCancel();
  };

  return (
    <div className="movie-item_box" onClick={handleClick}>
      <div className="movie-item_img">
        <img src={poster} alt={`${title}`} />
        <div className="movie-item_name">{videoName}</div>
      </div>
    </div>
  );
}

export default SearchResultItems;
