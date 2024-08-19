import { IoHomeOutline } from "react-icons/io5";
import { useOutsideClick } from "../hooks/useOutsideClick";

import { useNavigate } from "react-router-dom";

function Sidebar({ handleOpacity, dirs }) {
  console.log(dirs);

  const close = () => {
    handleOpacity(false);
  };
  const ref = useOutsideClick(close, "sidebar");
  const navigate = useNavigate();
  return (
    <div id="sidebar">
      <div className="sidebar" ref={ref}>
        <div className="logo">
          <IoHomeOutline className="icon mr" onClick={() => navigate("/")} />
        </div>
        <div className="features">
          <span>首页</span>
        </div>
        <ul className="videos">
          {dirs &&
            dirs.dirName.map((dir) => (
              <li
                key={dir.path}
                onClick={() => {
                  navigate(`/video?dirName=${dir.name}`);
                  close();
                }}
              >
                {dir.name}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
