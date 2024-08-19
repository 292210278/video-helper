import { createContext, useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { HiEllipsisVertical } from "react-icons/hi2";
import { useOutsideClick } from "../hooks/useOutsideClick";
import { AnimatePresence, motion } from "framer-motion";

const MenusContext = createContext();

function Menus({ children }) {
  const [animate, setAnimate] = useState(true);
  const [openId, setOpenId] = useState("");
  const [position, setPosition] = useState(null);

  const close = () => {
    setAnimate(false);
    setTimeout(() => {
      setOpenId("");
    }, 500);
  };
  const open = setOpenId;

  return (
    <MenusContext.Provider
      value={{
        openId,
        close,
        open,
        position,
        setPosition,
        animate,
        setAnimate,
      }}
    >
      {children}
    </MenusContext.Provider>
  );
}

function Menu() {
  return <div className="menu"></div>;
}

function Toggle({ id }) {
  const { openId, close, open, setPosition } = useContext(MenusContext);

  function handleClick(e) {
    e.stopPropagation();

    const rect = e.target.closest("button").getBoundingClientRect();
    setPosition({
      x: rect.x + 24,
      y: rect.y + 8,
    });

    openId === "" || openId !== id ? open(id) : close();
  }

  return (
    <button className="styled-toggle" onClick={handleClick}>
      <HiEllipsisVertical />
    </button>
  );
}

function List({ id, children }) {
  const { openId, position, close, animate, setAnimate } =
    useContext(MenusContext);

  const handleClose = () => {
    close();
  };
  const ref = useOutsideClick(handleClose, null, false, true);

  useEffect(() => {
    if (openId) {
      setAnimate(true);
    }
  }, [openId, setAnimate]);

  if (openId !== id) return null;

  const style = {
    position: "fixed",
    width: "6.4rem",
    height: "10rem",
    top: position?.y ?? "auto",
    left: position?.x ?? "auto",
    backgroundColor: "var(--second-color)",
    borderRadius: "8px",
  };

  return createPortal(
    <AnimatePresence>
      <motion.ul
        key={id}
        ref={ref}
        style={style}
        initial="closed"
        exit="closed"
        animate={animate ? "open" : "closed"}
        variants={{
          open: {
            clipPath: "inset(0% 0% 0% 0% round 10px)",
            transition: {
              type: "spring",
              bounce: 0,
              duration: 0.7,
              delayChildren: 0.3,
              staggerChildren: 0.05,
            },
          },
          closed: {
            clipPath: "inset(10% 50% 90% 50% round 10px)",
            transition: {
              type: "spring",
              bounce: 0,
              duration: 0.3,
            },
          },
        }}
      >
        {children}
      </motion.ul>
    </AnimatePresence>,
    document.body
  );
}

function Button({ children, onClick }) {
  const { close, setAnimate } = useContext(MenusContext);

  function handleClick() {
    onClick?.();
    close(setAnimate);
  }

  return (
    <li>
      <button className="styled-button" onClick={handleClick}>
        <span>{children}</span>
      </button>
    </li>
  );
}

Menus.Menu = Menu;
Menus.Toggle = Toggle;
Menus.List = List;
Menus.Button = Button;

export default Menus;
