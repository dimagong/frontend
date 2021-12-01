import xor from "lodash/fp/xor";
import { useMemo, useState } from "react";

export const useToggleable = (initialKeys = []) => {
  const [keys, setKeys] = useState(initialKeys);
  const isEmpty = useMemo(() => keys.length === 0, [keys]);

  const clear = () => setKeys([]);
  // :: string -> void
  const select = (toSelect) => setKeys((prev) => xor(prev, [toSelect]));
  // :: string[] -> void
  const toggle = (toSelectMany) => setKeys((prev) => xor(prev, toSelectMany));
  // :: string -> boolean
  const includes = (key) => keys.includes(key);

  return {
    keys,
    isEmpty,
    clear,
    toggle,
    select,
    setKeys,
    includes,
  };
};
