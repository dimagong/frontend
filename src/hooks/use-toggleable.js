import xor from "lodash/fp/xor";
import { useMemo, useState } from "react";

export const useToggleable = (initialKeys = []) => {
  const [keys, setKeys] = useState(initialKeys);
  const isEmpty = useMemo(() => keys.length === 0, [keys]);

  const clear = () => setKeys([]);
  // :: string | string[] -> void
  const toggle = (toSelect) => setKeys((prev) => xor(prev, Array.isArray(toSelect) ? toSelect : [toSelect]));
  // :: string -> boolean
  const includes = (key) => keys.includes(key);

  return {
    keys,
    isEmpty,
    clear,
    toggle,
    setKeys,
    includes,
  };
};
