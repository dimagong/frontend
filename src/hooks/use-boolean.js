import { useToggle } from "./use-toggle";

export const useBoolean = (initialState) => {
  const [value, toggle, setValue] = useToggle(initialState);
  const on = () => setValue(true);
  const off = () => setValue(false);

  return [value, on, off, toggle];
};
