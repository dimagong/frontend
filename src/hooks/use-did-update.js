import { useEffect, useRef } from "react";

export const useDidUpdate = (create, deps) => {
  const hasMountedRef = useRef(false);

  if (typeof deps !== "undefined" && !Array.isArray(deps)) {
    deps = [deps];
  } else if (Array.isArray(deps) && deps.length === 0) {
    console.warn(
      "Using [] as the second argument makes useDidUpdate a noop. The second argument should either be `undefined` or an array of length greater than 0."
    );
  }

  useEffect(() => {
    if (hasMountedRef.current) {
      create();
    } else {
      hasMountedRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};
