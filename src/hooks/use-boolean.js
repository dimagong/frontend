import { useCallback } from "react";
import { useToggle } from "./use-toggle";

export const useBoolean = (initialState) => {
  const [value, toggle, setValue] = useToggle(initialState);
  const on = useCallback(() => setValue(true), [setValue]);
  const off = useCallback(() => setValue(false), [setValue]);

  return [value, on, off, toggle];
};
