import { useCallback, useState } from "react";

const INITIAL_HIERARCHY_PARAMS = {
  name: "",
  applicationIds: [],
  onlyFiles: false,
  dateBegin: null,
  dateEnd: null,
  showEmptyFolders: false,
};

const EQUALITY_CHECKING_PARAMS_KEYS = ["name", "applicationIds", "onlyFiles", "dateBegin", "dateEnd"];

export const isParamsEqualToInitial = (params) => {
  return EQUALITY_CHECKING_PARAMS_KEYS.every((key) => {
    const paramValue = params[key];
    const initialParamValue = INITIAL_HIERARCHY_PARAMS[key];

    return paramValue === initialParamValue;
  });
};

export const useHierarchyByUserSearch = (userId) => {
  const [params, setParams] = useState({ userId, ...INITIAL_HIERARCHY_PARAMS });

  const reduceParams = useCallback((partialParams) => {
    setParams((prevParams) => {
      const mergedParams = { ...prevParams, ...partialParams };

      return {
        ...mergedParams,
        // When params is not initial -> show the empty folders
        showEmptyFolders: isParamsEqualToInitial(mergedParams),
      };
    });
  }, []);

  return [params, reduceParams];
};
