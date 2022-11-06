import { useEffect } from "react";
import { useDev } from "./useDev";
import { devWarning } from "./devWarning";

export const useDevSetupWarning = (fn: () => void, deps?: any[]) => {
  useDev(() => {
    useEffect(() => {
      try {
        fn();
      } catch (error) {
        devWarning(`
          A setup problem was encountered.

          > ${error.message}
        `);
      }
    }, deps);
  });
};
