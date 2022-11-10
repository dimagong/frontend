import { Environment } from "./env";

const prefix = "Unexpected";

export function unexpected(message: string): never {
  if (Environment.isProd) {
    throw new Error(prefix);
  }

  throw new Error(`${prefix}: ${message}`);
}
