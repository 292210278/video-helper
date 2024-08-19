import { useEffect, useRef } from "react";

export function useOutsideClick(handle, openName, listenCapture = true, menu) {
  const ref = useRef();

  useEffect(
    function () {
      function handleClick(e) {
        if (ref.current && !ref.current.contains(e.target)) {
          if (
            (e.target.id === openName && e.target.id) ||
            menu ||
            e.target.id === "delay"
          )
            handle();
        }

        return document.removeEventListener("click", handle, listenCapture);
      }
      document.addEventListener("click", handleClick, listenCapture);

      return () => document.removeEventListener("click", handle, listenCapture);
    },
    [handle, listenCapture, openName, menu]
  );

  return ref;
}
``;
