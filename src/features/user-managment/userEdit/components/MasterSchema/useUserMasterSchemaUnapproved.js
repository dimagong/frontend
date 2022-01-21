import React from "react";
import { toast } from "react-toastify";

import masterSchemaApi from "api/masterSchema/masterSchema";
import { normalizeUnapproved } from "api/masterSchema/normalizers";

export const useUserMasterSchemaUnapproved = (masterSchemaId) => {
  const isMountedRef = React.useRef(true);
  const [data, setData] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const fetch = React.useCallback(
    () =>
      masterSchemaApi
        .getUnapproved({ id: masterSchemaId })
        .then((unapproved) => (unapproved ? normalizeUnapproved(unapproved) : null))
        .then((data) => isMountedRef.current && setData(data))
        .catch((error) => toast.error(error))
        .finally(() => setIsLoading(false)),
    [masterSchemaId]
  );

  const refresh = () => {
    setIsLoading(true);
    fetch();
  };

  React.useEffect(() => {
    if (!masterSchemaId) return;

    isMountedRef.current = true;
    setIsLoading(true);
    fetch();

    return () => (isMountedRef.current = false);
  }, [fetch, masterSchemaId]);

  return { data, isLoading, refresh };
};
