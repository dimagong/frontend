import { useDev } from "./useDev";
import { invariant } from "./invariant";

export function useDevInvariant(value: unknown, message: string): asserts value {
  useDev(() => {
    invariant(value, message);
  });
}
