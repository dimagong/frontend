import { Environment } from "./env";

function assert(value: unknown, message: string): asserts value {
  if (!Environment.isDev) {
    return;
  }

  if (!value) {
    throw new Error(`Invariant Violation: ${message}`);
  }
}

export function invariant<T>(value: T, message: string): asserts value;
export function invariant<T>(message: string): (value: T) => NonNullable<T>;
export function invariant<T>(...args: [string] | [T, string]): any {
  switch (args.length) {
    case 1:
      return (value: T) => {
        const message = args[0];
        assert(value, message);
        return value as NonNullable<T>;
      };
    case 2:
      const value = args[0];
      const message = args[1];
      assert(value, message);
  }
}
