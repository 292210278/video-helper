import Loader from "../../ui/Loader";
import SearchResultItems from "./SearchResultItems";

function SearchResults({ type, searchResults, searchLoading, handleCancel }) {
  const { results = [] } = searchResults || {};

  return (
    <div className="search-results">
      {searchLoading === true ? (
        <Loader />
      ) : (
        results.map((movie) => (
          <SearchResultItems
            type={type}
            movieItem={movie}
            key={movie.id}
            handleCancel={handleCancel}
          />
        ))
      )}
    </div>
  );
}

export default SearchResults;
