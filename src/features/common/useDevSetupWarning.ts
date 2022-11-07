import { useEffect } from "react";
import { useDev } from "./useDev";
import { devWarning } from "./devWarning";

export const useDevSetupWarning = (fn: () => void, deps?: any[]) => {
  useDev(() => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
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
