import { motion } from "framer-motion";
import { useEffect, useState } from "react";

function Transition({
  children,
  isLoading = false,
  duration = 650,
  isDetail = false,
}) {
  const [shouldExit, setShouldExit] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  useEffect(() => {
    if (isDetail) {
      console.log(isDetail);

      if (!isLoading) {
        setShouldExit(true);
      } else {
        setShouldExit(false);
      }
    }
  }, [isLoading, isDetail]);

  return (
    <>
      {show && children}
      <motion.div
        className="slide-in"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: shouldExit ? 0 : 1 }}
        exit={{ scaleX: 0 }}
        transition={{ duration: 1, ease: [0.33, 1, 0.36, 1] }}
        onAnimationComplete={() => {
          if (!isDetail) setShouldExit(true);
        }}
      >
        <span className="loader-text">正在前往</span>
      </motion.div>
    </>
  );
}

export default Transition;
