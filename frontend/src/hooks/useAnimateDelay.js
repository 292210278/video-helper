import { useEffect, useState } from "react";

export function useAnimateDelay(shouldShow, duration) {
  const [animate, setAnimate] = useState(shouldShow);
  const [show, setShow] = useState(false);
  useEffect(() => {
    let timer = "";
    if (shouldShow) {
      setAnimate(true);
      setShow(true);
    } else {
      setShow(false);
      timer = setTimeout(() => {
        console.log(123);

        setAnimate(false);
      }, 1000);
    }

    return () => clearTimeout(timer);
  }, [shouldShow, duration]);

  return { animate, show, setAnimate };
}
