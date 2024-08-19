import { FiAlignJustify } from "react-icons/fi";
import { IoHomeOutline } from "react-icons/io5";
import { useNavigate, useSearchParams } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useContext, useEffect, useState } from "react";
import Search from "../features/video-search/Search";
import { motion } from "framer-motion";
import SearchContext from "../contexts/SearchContext";
import { useGetDir } from "../features/user-movies/useGetDir";
import { BiCog } from "react-icons/bi";
import Modal from "./Modal";
import ConfigForm from "./ConfigForm";
import ConfigContext from "../contexts/ConfigContext";
import { SlArrowLeft } from "react-icons/sl";

function Header({ children }) {
  const [opacity, setOpacity] = useState(false);

  const navigate = useNavigate();
  const { setDirs } = useContext(SearchContext);
  const { videoPath } = useContext(ConfigContext);
  const { isLoading, dirs } = useGetDir(videoPath);
  const [searchParams] = useSearchParams();

  const dirName = searchParams.get("dirName");
  useEffect(() => {
    if (!isLoading) {
      setDirs(dirs);
    }
  }, [isLoading, dirs, setDirs]);

  const sidebarVariants = {
    open: {
      x: 0, // 侧边栏完全展开
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    closed: {
      x: "-120%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  };
  return (
    <>
      <header>
        <div className="icons">
          <IoHomeOutline className="icon mr" onClick={() => navigate("/")} />
          <FiAlignJustify
            className="icon mr"
            onClick={() => setOpacity(true)}
          />
          <SlArrowLeft onClick={() => navigate(-1)} />
          <Modal>
            <Modal.Open opens="config">
              <BiCog className="icon mr" />
            </Modal.Open>
            <Modal.Window name="config">
              <ConfigForm />
            </Modal.Window>
          </Modal>
        </div>
        <h1>{dirName}</h1>
        <div className="search-input_container">
          <Search />
        </div>
      </header>
      {children}
      <div className={opacity ? "delay" : ""} id="delay">
        <motion.div
          initial="closed"
          animate={opacity ? "open" : "closed"}
          variants={sidebarVariants}
          exit="closed"
          style={{
            width: "220px",
            height: "100vh",
            background: "#333",
            color: "#fff",
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 1000,
          }}
        >
          <Sidebar handleOpacity={setOpacity} dirs={dirs} />
        </motion.div>
      </div>
    </>
  );
}

export default Header;
