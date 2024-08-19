import { useContext, useEffect, useState } from "react";
import SearchMovieResults from "../video-search/SearchMovieResults";
import { useMovie } from "../video-search/useMovie";
import SearchContext from "../../contexts/SearchContext";
import { AnimatePresence, motion } from "framer-motion";
import { useAnimateDelay } from "../../hooks/useAnimateDelay";

function Search() {
  const [movieQuery, setMovieQuery] = useState("");
  const [type, setType] = useState("movie");
  const { isLoading, movies } = useMovie(movieQuery, type);
  const [searchBox, setSearchBox] = useState(false);
  const { setQuery, setSearchType } = useContext(SearchContext);
  const { animate, show } = useAnimateDelay(searchBox);

  useEffect(() => {
    setQuery(() => setMovieQuery);
    setSearchType(() => setType);
  }, [setMovieQuery, setQuery, setSearchType]);
  function handleCancel() {
    setSearchBox(false);
    setMovieQuery("");
  }

  useEffect(() => {
    const handleClickOutside = (e) => {
      const searchBoxElement = document.querySelector(".search-results");
      const inputElement = document.querySelector(".search-result-input");
      const selectElement = document.querySelector(".search-result-select");

      if (
        searchBoxElement &&
        !searchBoxElement.contains(e.target) &&
        !selectElement.contains(e.target) &&
        !inputElement.contains(e.target)
      ) {
        handleCancel();
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <>
      <input
        className="search-result-input"
        type="text"
        value={movieQuery}
        onChange={(e) => setMovieQuery(e.target.value)}
        onFocus={() => setSearchBox(true)}
      />
      <select
        className="search-result-select"
        value={type}
        onChange={(e) => {
          setType(e.target.value);
        }}
      >
        <option className="search-result-option" value="movie">
          电影
        </option>
        <option className="search-result-option" value="tv">
          剧集
        </option>
      </select>

      {animate ? (
        <AnimatePresence>
          <div className={show ? "delay" : ""}>
            <motion.div
              key={54646}
              className="search-animate"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: show ? 1 : 0 }}
              exit={{ transitionY: 0 }}
              onAnimationComplete={() => console.log("Animation complete")}
            >
              <SearchMovieResults
                type={type}
                handleCancel={handleCancel}
                searchResults={movies}
                searchLoading={isLoading}
                setSearchBox={show}
              />
            </motion.div>
          </div>
        </AnimatePresence>
      ) : null}
    </>
  );
}

export default Search;
