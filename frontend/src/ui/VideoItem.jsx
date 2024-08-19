import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import { useEffect, useState } from "react";
import { getPoster } from "../services/apiPhoto";

function VideoItem({ dir, dirName }) {
  const [name = "", id = "", type = ""] = (dir?.name || "").split("-");
  const [poster, setPoster] = useState([]);

  useEffect(() => {
    async function fetchPoster() {
      try {
        const data = await getPoster(name);
        setPoster(data.data);
      } catch (error) {
        console.error("Error fetching poster:", error);
        setPoster("");
      }
    }

    fetchPoster();
  }, [name]);

  const navigate = useNavigate();
  return (
    <motion.div
      whileHover={{ scale: [null, 1.1, 1.05] }}
      transition={{ duration: 0.3 }}
    >
      <li
        className="movie-item"
        onClick={() => {
          navigate(`/video-detail?id=${id}&type=${type}&dirName=${dirName}`, {
            state: { path: dir.path },
          });
        }}
      >
        <img
          src={poster && poster?.[0] ? poster[0]?.imagePath : "/p1.jpg"}
          alt=""
        />
        <span className="movie-item-name">{name || ""}</span>
      </li>
    </motion.div>
  );
}

export default VideoItem;
