import React from "react";

export const useFreshFn = (fn) => {
  const isMountedRef = React.useRef(false);

  React.useEffect(() => {
    isMountedRef.current = true;
    return () => (isMountedRef.current = false);
  }, []);

  return React.useCallback(
    (...args) => {
      if (isMountedRef.current) {
        return fn(...args);
      }
    },
    [fn]
  );
};
