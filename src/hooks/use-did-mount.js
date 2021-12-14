import { useEffect } from "react";

export const useDidMount = (create) =>
  useEffect(() => {
    if (typeof create === "function") {
      create();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
