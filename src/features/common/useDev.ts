import { Environment } from "./env";

export const useDev = (useHook: () => void) => {
  if (!Environment.isProd) {
    useHook();
  }
};
