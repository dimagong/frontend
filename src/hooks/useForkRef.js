import React from "react";

export const useForkRef = (...refs) => {
  const targetRef = React.useRef();

  React.useLayoutEffect(() => {
    refs.forEach((ref) => {
      if (!ref) return;

      if (typeof ref === "function") {
        ref(targetRef.current);
      } else {
        ref.current = targetRef.current;
      }
    });
  }, [refs]);

  return targetRef;
};
