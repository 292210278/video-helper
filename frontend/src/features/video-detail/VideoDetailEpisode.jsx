import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function VideoDetailEpisode({ item, index }) {
  const navigate = useNavigate();

  function play(item) {
    navigate(`/video-play?videoSrc=${item}`);
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
