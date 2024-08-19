import MovieItem from "./VideoItem";

function RecentWatchedList() {
  return (
    <div>
      <ul className="recent-watched-list">
        <MovieItem />
        <MovieItem />
      </ul>
    </div>
  );
}

export default RecentWatchedList;
