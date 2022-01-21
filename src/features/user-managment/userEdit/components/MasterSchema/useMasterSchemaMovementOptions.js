import React from "react";
import { toast } from "react-toastify";

import masterSchemaApi from "api/masterSchema/masterSchema";
import { normalizeGroups } from "api/masterSchema/normalizers";

export const useMasterSchemaMovementOptions = (masterSchemaId) => {
  const isMountedRef = React.useRef(true);
  const [data, setData] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const fetch = React.useCallback(
    () => masterSchemaApi
      .getGroups({ masterSchemaId })
      .then((raw) => raw ? normalizeGroups(raw) : null)
      .then((data) => isMountedRef.current && setData(data))
      .catch((error) => toast.error(error))
      .finally(() => setIsLoading(false)),
    [masterSchemaId]
  );

  const refresh = () => {
    setIsLoading(true);
    fetch();
  };

  React.useEffect(
    () => {
      if (!masterSchemaId) return;
      isMountedRef.current = true;
      fetch();

      return () => isMountedRef.current = false;
    },
    [fetch, masterSchemaId]
  );

  return { data, isLoading, refresh };
};
