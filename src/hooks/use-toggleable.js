import xor from 'lodash/fp/xor';
import { useCallback, useState } from 'react';

export const useToggleable = (initialKeys = []) => {
  const [keys, setKeys] = useState(initialKeys);
  // :: string[] -> void
  const toggle = (toSelect) => setKeys((prev) => xor(prev, toSelect));
  const includes = useCallback((key) => keys.includes(key), [keys]);

  return {
    keys,
    toggle,
    includes,
  };
};
