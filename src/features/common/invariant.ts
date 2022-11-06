import { Environment } from "./env";
import { asserts } from "./asserts";

const prefix = "Invariant Violation";

export function invariant(value: unknown, message: string): asserts value {
  if (Environment.isProd) {
    asserts(value, prefix);
    return;
  }

  asserts(value, `${prefix}: ${message}`);
}
