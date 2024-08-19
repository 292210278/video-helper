import UserMovies from "../features/user-movies/UserMovies";
import PokerSlider from "../ui/PokerSlider";
import Transition from "../ui/Transition";

function Home() {
  return (
    <Transition>
      <div className="layout">
        <PokerSlider />
        <UserMovies />
      </div>
    </Transition>
  );
}

export default Home;
