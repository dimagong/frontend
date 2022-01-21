import _ from "lodash/fp";
import React from "react";
import { toast } from "react-toastify";

import masterSchemaApi from "api/masterSchema/masterSchema";
import { normalizeHierarchy } from "api/masterSchema/normalizers";

const initialSearchParams = { name: "", application_ids: [], date_begin: null, date_end: null };

export const useUserMasterSchemaHierarchy = (userId) => {
  const isMountedRef = React.useRef(true);
  const [data, setData] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchParams, setSearchParams] = React.useReducer((s, p) => ({ ...s, ...p }), initialSearchParams);

  const fetch = React.useCallback(
    (params) =>
      masterSchemaApi
        .getHierarchyByUserId(userId, params)
        .then((hierarchy) => (hierarchy ? normalizeHierarchy(hierarchy) : null))
        .then((data) => isMountedRef.current && setData(data))
        .catch((error) => toast.error(error))
        .finally(() => setIsLoading(false)),
    [userId]
  );

  const refresh = () => {
    setIsLoading(true);
    fetch();
  };

  const isSearchParamsInitial = () => {
    return (
      searchParams.name === "" &&
      _.isEmpty(searchParams.application_ids) &&
      !searchParams.date_begin &&
      !searchParams.date_end
    );
  };

  React.useEffect(() => {
    isMountedRef.current = true;
    setIsLoading(true);
    fetch();

    return () => (isMountedRef.current = false);
    // It's initial fetch
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    setIsLoading(true);
    fetch(searchParams);
  }, [fetch, searchParams]);

  return { data, isLoading, refresh, searchParams, isSearchParamsInitial, setSearchParams };
};
