import Transition from "../ui/Transition";
import VideoList from "../ui/VideoList";

function Video() {
  return (
    <Transition>
      <main>
        <VideoList />
      </main>
    </Transition>
  );
}

export default Video;
