import { useContext } from "react";
import { cloneElement } from "react";
import { useState } from "react";
import { createContext } from "react";
import { createPortal } from "react-dom";
import { HiXMark } from "react-icons/hi2";
import { useOutsideClick } from "../hooks/useOutsideClick";
import { motion } from "framer-motion";

const ModalContext = createContext();

function Modal({ children }) {
  const [openName, setOpenName] = useState("");

  const close = () => setOpenName("");

  const open = setOpenName;

  const [imgPath, setImgPath] = useState("");
  return (
    <ModalContext.Provider
      value={{ openName, close, open, imgPath, setImgPath }}
    >
      {children}
    </ModalContext.Provider>
  );
}

function Open({ children, opens: opensWindowName }) {
  const { open, setImgPath } = useContext(ModalContext);

  return cloneElement(children, {
    onClick: (e) => {
      setImgPath(e.target.src);
      open(opensWindowName);
    },
  });
}

function Window({ children, name, type = "modal" }) {
  const { openName, close, imgPath } = useContext(ModalContext);

  const ref = useOutsideClick(close, openName);
  // useEffect(
  //   function () {
  //     const delay = document.querySelector(".delay");
  //     console.log(delay);

  //     if (delay) {
  //       document.body.style.overflow = "hidden";
  //     } else {
  //       document.body.style.overflow = "none";
  //     }
  //   },
  //   [name]
  // );
  if (name !== openName) return null;

  if (type === "img")
    return imgPath
      ? createPortal(
          <div className="delay" id={name}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ ease: "easeOut", duration: 0.5 }}
            >
              <div ref={ref}>
                {cloneElement(children, { onCloseModal: close, src: imgPath })}
              </div>
            </motion.div>
          </div>,
          document.body
        )
      : null;

  return createPortal(
    <div className="delay" id={name}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ ease: "easeOut", duration: 0.5 }}
      >
        <div className="modal" ref={ref}>
          <button className="modal-close" onClick={close}>
            <HiXMark />
          </button>
          <div>
            {cloneElement(children, { onCloseModal: close, src: imgPath })}
          </div>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}

Modal.Open = Open;
Modal.Window = Window;

export default Modal;
