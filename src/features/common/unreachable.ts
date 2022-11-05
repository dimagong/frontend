import { Environment } from "./env";

export function unreachable(message: string): never {
  if (!Environment.isDev) {
    return void 0 as never;
  }

  throw new Error(`Unreachable: ${message}`);
}
