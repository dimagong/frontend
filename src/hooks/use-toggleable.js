import _ from "lodash/fp";
import React from "react";

export const useToggleable = (initialKeys = [], options) => {
  options = _.merge(useToggleable.defaultOptions, options);

  const [keys, setKeys] = React.useState(initialKeys);
  const isEmpty = React.useMemo(() => keys.length === 0, [keys]);

  const clear = React.useCallback(() => setKeys([]), []);
  // :: string | string[] -> void
  const toggle = React.useCallback((toSelect) => setKeys((prev) => _.xor(prev, Array.isArray(toSelect) ? toSelect : [toSelect])), []);
  // :: string -> boolean
  const includes = React.useCallback((key) => keys.includes(key), [keys]);

  return options.useRefactored ? [
    keys,
    {
      isEmpty,
      clear,
      toggle,
      setKeys,
      includes,
    }
  ] : {
    keys,
    isEmpty,
    clear,
    toggle,
    setKeys,
    includes,
  };
};

useToggleable.defaultOptions = { useRefactored: false };
