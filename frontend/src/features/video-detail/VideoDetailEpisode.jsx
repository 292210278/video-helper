import { motion } from "framer-motion";
import { useContext } from "react";
import ConfigContext from "../../contexts/ConfigContext";

function VideoDetailEpisode({ item, index }) {
  const { playerPath } = useContext(ConfigContext);
  let timer = null;
  async function play(path) {
    if (!timer) {
      timer = setTimeout(() => {
        fetch(
          `http://localhost:3000/play?path=${path}&playerPath=${playerPath}`
        );
        clearTimeout(timer);
        timer = null;
      }, 5000);
    }
  }
  return (
    <motion.li
      className="video-detail-episode"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", duration: 0.3 }}
      onClick={() => play(item)}
    >
      {index}
    </motion.li>
  );
}

export default VideoDetailEpisode;
