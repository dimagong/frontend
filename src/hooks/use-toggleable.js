import xor from 'lodash/fp/xor';
import { useState } from 'react';

export const useToggleable = (initialKeys = []) => {
  const [keys, setKeys] = useState(initialKeys);
  // :: string[] -> void
  const toggle = (toSelect) => setKeys((prev) => xor(prev, toSelect));
  const includes = (key) => keys.includes(key);

  return {
    keys,
    toggle,
    includes,
  };
};
