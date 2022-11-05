import { Environment } from "./env";

export const warning = (msg: string, ...optionalParams: any[]) => {
  if (!Environment.isDev) {
    return;
  }

  console.warn(msg, ...optionalParams);
};
