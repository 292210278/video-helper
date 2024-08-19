import { createContext, useState } from "react";

const SearchContext = createContext();

export function SearchProvider({ children }) {
  const [searchQuery, setQuery] = useState("");
  const [videos, setVideos] = useState([]);
  const [dirs, setDirs] = useState([]);
  const [searchType, setSearchType] = useState("");

  return (
    <SearchContext.Provider
      value={{
        searchType,
        setSearchType,
        dirs,
        setDirs,
        searchQuery,
        setQuery,
        videos,
        setVideos,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export default SearchContext;
