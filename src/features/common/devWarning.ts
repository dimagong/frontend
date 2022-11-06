import { Environment } from "./env";

const log = (type: "warn" | "error", message: string) => {
  if (Environment.isProd) {
    return;
  }

  console[type](message);
};

export const devError: (message: string) => void = log.bind(null, "error");
export const devWarning: (message: string) => void = log.bind(null, "warn");
