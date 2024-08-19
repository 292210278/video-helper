import { useContext } from "react";
import AddMovieDir from "../features/user-movies/AddMovieDir";
import MovieDirItem from "./MovieDirItem";
import SearchContext from "../contexts/SearchContext";

function UserMovieList() {
  const { dirs } = useContext(SearchContext);

  if (!dirs) {
    return <AddMovieDir type="dir" />;
  }

  return (
    <ul className="movie-dir">
      {dirs.dirName?.length > 0 ? (
        dirs.dirName.map((dir) => <MovieDirItem key={dir.path} dir={dir} />)
      ) : (
        <li>未找到项目,请添加项目</li>
      )}
      <AddMovieDir type="dir" />
    </ul>
  );
}

export default UserMovieList;
