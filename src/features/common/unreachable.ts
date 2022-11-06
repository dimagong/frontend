import { Environment } from "./env";

const prefix = "Unreachable";

export function unreachable(message: string): never {
  if (Environment.isProd) {
    throw new Error(prefix);
  }

  throw new Error(`${prefix}: ${message}`);
}
