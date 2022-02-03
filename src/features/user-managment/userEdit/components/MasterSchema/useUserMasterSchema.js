import _ from "lodash/fp";
import React from "react";
import { toast } from "react-toastify";

import { useDidUpdate } from "hooks/use-did-update";

import masterSchemaApi from "api/masterSchema/masterSchema";
import { normalizeGroups, normalizeHierarchy, normalizeUnapproved } from "api/masterSchema/normalizers";

const useFreshFn = (fn) => {
  const fnRef = React.useRef(fn);

  React.useLayoutEffect(() => {
    fnRef.current = fn;
    return () => (fnRef.current = null);
    // should be invoked only on mounted/unmounted
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return React.useCallback((...args) => (_.isFunction(fnRef.current) ? fnRef.current(...args) : void 0), []);
};

const useAsync = (initialState = {}) => {
  const initialStateRef = React.useRef({ ...useAsync.DEFAULT_STATE, ...initialState });
  const [{ status, data, error }, setState] = React.useReducer((s, p) => ({ ...s, ...p }), initialStateRef.current);

  const freshSetState = useFreshFn(setState);

  // const setPending = React.useCallback(() => freshSetState({ status: useAsync.STATUS.Pending }), [freshSetState]);
  const setData = React.useCallback(
    (data) => freshSetState({ status: useAsync.STATUS.Resolved, data }),
    [freshSetState]
  );
  const setError = React.useCallback(
    (error) => freshSetState({ status: useAsync.STATUS.Rejected, error }),
    [freshSetState]
  );
  const reset = React.useCallback(() => freshSetState(initialStateRef.current), [freshSetState]);

  const run = React.useCallback(
    (promise) => {
      if (!promise || !_.isFunction(promise.then)) {
        throw new Error("useAsync#run should be invoked with promise as first argument!");
      }

      freshSetState({ status: useAsync.STATUS.Pending });

      return promise.then(
        (data) => {
          setData(data);
          return data;
        },
        (error) => {
          setError(error);
          return Promise.reject(error);
        }
      );
    },
    [freshSetState, setData, setError]
  );

  return {
    isIdle: status === useAsync.STATUS.Idle,
    isError: status === useAsync.STATUS.Rejected,
    isLoading: status === useAsync.STATUS.Pending,
    isSuccess: status === useAsync.STATUS.Resolved,

    data,
    error,
    status,

    run,
    reset,
    setData,
    setError,
  };
};

useAsync.STATUS = {
  Idle: Symbol("useAsync#IdleStatus"),
  Pending: Symbol("useAsync#PendingStatus"),
  Resolved: Symbol("useAsync#ResolvedStatus"),
  Rejected: Symbol("useAsync#RejectedStatus"),
};

useAsync.DEFAULT_STATE = { status: useAsync.STATUS.Idle, data: null, error: null };

const initialSearchParams = { name: "", application_ids: [], only_files: false, date_begin: null, date_end: null };

const useUserMasterSchemaHierarchy = (userId) => {
  const { data, isLoading, run } = useAsync();
  const [searchParams, setSearchParams] = React.useReducer((s, p) => ({ ...s, ...p }), initialSearchParams);

  const fetch = React.useCallback(
    (params) => {
      return run(
        masterSchemaApi
          .getHierarchyByUserId(userId, params)
          .then((hierarchy) => (hierarchy ? normalizeHierarchy(hierarchy) : null))
          .catch((error) => {
            toast.error(error);
            return Promise.reject(error);
          })
      );
    },
    [run, userId]
  );

  const isSearchParamsInitial = React.useCallback(() => {
    return (
      searchParams.name === "" &&
      _.isEmpty(searchParams.application_ids) &&
      !searchParams.only_files &&
      !searchParams.date_begin &&
      !searchParams.date_end
    );
  }, [searchParams]);

  useDidUpdate(() => void fetch({ ...searchParams, show_empty_folders: false }), [searchParams]);

  useDidUpdate(() => void setSearchParams(initialSearchParams), [userId]);

  return { data, isLoading, fetch, searchParams, isSearchParamsInitial, setSearchParams };
};

const useMasterSchemaNodeCreator = (apiCreateMethod) => {
  const { isLoading, run } = useAsync();

  const create = React.useCallback(
    (creationData) => {
      return run(
        apiCreateMethod(creationData).catch((error) => {
          toast.error(error);
          return Promise.reject(error);
        })
      );
    },
    [apiCreateMethod, run]
  );

  return { isLoading, create };
};

const useMasterSchemaElementCreator = () => {
  const fieldCreator = useMasterSchemaNodeCreator(masterSchemaApi.addField);
  const groupCreator = useMasterSchemaNodeCreator(masterSchemaApi.addGroup);

  const isLoading = React.useMemo(
    () => fieldCreator.isLoading || groupCreator.isLoading,
    [fieldCreator.isLoading, groupCreator.isLoading]
  );

  return {
    isLoading,
    createField: fieldCreator.create,
    createGroup: groupCreator.create,
  };
};

// useful logic - do not remove
// eslint-disable-next-line no-unused-vars
const useMasterSchemaMovementOptions = () => {
  const { data, isLoading, run } = useAsync();

  const fetch = React.useCallback(
    (masterSchemaId) => {
      return run(
        masterSchemaApi
          .getGroups({ masterSchemaId })
          .then((raw) => (raw ? normalizeGroups(raw) : null))
          .catch((error) => {
            toast.error(error);
            return Promise.reject(error);
          })
      );
    },
    [run]
  );

  return { data, isLoading, fetch };
};

// useful logic - do not remove
// eslint-disable-next-line no-unused-vars
const useUserMasterSchemaUnapproved = () => {
  const { data, isLoading, run } = useAsync();

  const fetch = React.useCallback(
    (masterSchemaId) => {
      return run(
        masterSchemaApi
          .getUnapproved({ id: masterSchemaId })
          .then((unapproved) => (unapproved ? normalizeUnapproved(unapproved) : null))
          .catch((error) => {
            toast.error(error);
            return Promise.reject(error);
          })
      );
    },
    [run]
  );

  return { data, isLoading, fetch };
};

const useMasterSchemaApproveUnapprovedFields = () => {
  const { isLoading, run } = useAsync();

  const approve = React.useCallback(
    (approveData) => {
      return run(
        masterSchemaApi.fieldsMakeParent(approveData).catch((error) => {
          toast.error(error);
          return Promise.reject(error);
        })
      );
    },
    [run]
  );

  return { approve, isLoading };
};

export const useUserMasterSchema = (userId) => {
  const elementCreator = useMasterSchemaElementCreator();
  const fieldsApproving = useMasterSchemaApproveUnapprovedFields();

  const hierarchy = useUserMasterSchemaHierarchy(userId);
  // const unapproved = useUserMasterSchemaUnapproved();
  // const movementOptions = useMasterSchemaMovementOptions();

  const fetch = React.useCallback(() => {
    hierarchy.fetch({ show_empty_folders: true });
    // imported logic of unapproved
    // .then(({ masterSchemaId }) => {
    //   unapproved.fetch(masterSchemaId);
    //   movementOptions.fetch(masterSchemaId);
    // });
  }, [hierarchy]);

  const createField = React.useCallback(
    (creationData) => {
      elementCreator.createField(creationData).then(() => hierarchy.fetch());
      // imported logic of unapproved
      // .then(({ masterSchemaId }) => movementOptions.fetch(masterSchemaId))
    },
    [elementCreator, hierarchy]
  );

  const createGroup = React.useCallback(
    (creationData) => {
      elementCreator.createGroup(creationData).then(() => hierarchy.fetch());
      // imported logic of unapproved
      // .then(({ masterSchemaId }) => movementOptions.fetch(masterSchemaId))
    },
    [elementCreator, hierarchy]
  );

  // const approveUnapproved = React.useCallback(
  //   (approveData) => {
  //     fieldsApproving
  //       .approve(approveData)
  //       .then(() => hierarchy.fetch())
  //       .then(({ masterSchemaId }) => unapproved.fetch(masterSchemaId));
  //   },
  //   [fieldsApproving, hierarchy, unapproved]
  // );

  return {
    hierarchy,
    // unapproved,
    // movementOptions,

    fetch,

    createField,
    createGroup,
    elementCreationLoading: elementCreator.isLoading,

    // approveUnapproved,
    fieldsApprovingLoading: fieldsApproving.isLoading,
  };
};
