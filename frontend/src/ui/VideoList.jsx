import { useContext } from "react";
import AddMovieDir from "../features/user-movies/AddMovieDir";
import VideoItem from "./VideoItem";
import SearchContext from "../contexts/SearchContext";
import { useSearchParams } from "react-router-dom";

function VideoList() {
  const { dirs } = useContext(SearchContext);
  const [searchParams] = useSearchParams();
  const dirName = searchParams.get("dirName");

  // 在数据未加载时显示 loading 状态
  if (!dirs) {
    return <div>Loading...</div>;
  }

  return (
    <ul className="video-list">
      {dirs.dirName?.length > 0 ? (
        dirs.dirName.map((dir) => {
          if (dir.name === dirName)
            return dir.children.map((dir) => (
              <VideoItem key={dir.path} dir={dir} dirName={dirName} />
            ));
        })
      ) : (
        <li>No directories found</li>
      )}
      <AddMovieDir />
    </ul>
  );
}

export default VideoList;
