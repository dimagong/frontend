import { Environment } from "./env";

export const useDev = (useHook: () => void) => {
  if (!Environment.isProd) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useHook();
  }
};
