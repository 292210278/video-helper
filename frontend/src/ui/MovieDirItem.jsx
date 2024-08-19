import { useState } from "react";

import { useNavigate } from "react-router-dom";
import Menus from "./Menus";
import { motion } from "framer-motion";
import { useDeleteDir } from "../features/user-movies/useDeleteDir";

function MovieDirItem({ dir }) {
  const [opacity, setOpacity] = useState(false);
  const { mutate } = useDeleteDir();
  const navigate = useNavigate();
  function handleDelete(path) {
    mutate(path);
  }

  return (
    <Menus>
      <motion.div
        whileHover={{ scale: [null, 1.1, 1.05] }}
        transition={{ duration: 0.3 }}
      >
        <li
          className="movie-dir-item"
          onClick={() => {
            navigate(`/video?dirName=${dir.name}`);
          }}
          onMouseEnter={() => {
            setOpacity(true);
          }}
          onMouseLeave={() => {
            setOpacity(false);
          }}
        >
          <img
            src={`http://localhost:3000/public/目录/${dir.name}/poster.png`}
            alt=""
          />

          {opacity && (
            <div className="movie-delay">
              <Menus.Toggle className="icon" id="toggle"></Menus.Toggle>
            </div>
          )}
        </li>

        <span className="movie-dir-item-name">{dir.name}</span>
      </motion.div>
      <Menus.List id="toggle">
        <Menus.Button onClick={() => handleDelete(dir.path)}>删除</Menus.Button>
      </Menus.List>
    </Menus>
  );
}

export default MovieDirItem;
