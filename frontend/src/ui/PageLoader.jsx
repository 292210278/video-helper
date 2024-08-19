import {
  useState,
  createContext,
  useContext,
  cloneElement,
  useEffect,
} from "react";
import { motion, useAnimation } from "framer-motion";
import { createPortal } from "react-dom";

const LoadingContext = createContext();

const PageLoader = ({ children }) => {
  const controls = useAnimation();
  const [isVisible, setIsVisible] = useState(false);

  return (
    <LoadingContext.Provider value={{ isVisible, controls, setIsVisible }}>
      {children}
    </LoadingContext.Provider>
  );
};

function Loading({ children, loading, handleClick }) {
  const { setIsVisible } = useContext(LoadingContext);
  return cloneElement(children, {
    onClick: () => {
      setIsVisible(loading);
      handleClick();
    },
  });
}

function Page() {
  const { controls, isVisible } = useContext(LoadingContext);
  console.log(isVisible);
  useEffect(() => {
    if (isVisible) {
      controls.start({
        x: 0, // 从右侧（100%）移动到中间（0%）
        transition: { duration: 1 },
      });

      const timer = setTimeout(() => {
        controls.start({
          x: "100%", // 从中间（0%）移动到左侧（-100%）
          transition: { duration: 1 },
        });
      }, 2000); // 2秒后隐藏加载页

      return () => clearTimeout(timer);
    }
  }, [controls, isVisible]);

  if (!isVisible) {
    return null; // 如果不可见，则不渲染组件
  }

  return (
    createPortal(
      <motion.div
        className="page-loader"
        initial={{ x: "100%" }} // 初始状态从右侧移入
        animate={controls}
      >
        Loading...
      </motion.div>
    ),
    document.body
  );
}
PageLoader.Loading = Loading;
PageLoader.Page = Page;

export default PageLoader;
