import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { createLoadingSelector } from "app/selectors/loadingSelector";

// ToDo: callbacks: onSuccess, onError, onFinally
export const useStoreQuery = (actionCreator, selector, deps = []) => {
  const dispatch = useDispatch();
  const data = useSelector(selector);
  const action = React.useMemo(actionCreator, [actionCreator]);
  const isLoading = useSelector(createLoadingSelector([action.type]));

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => void dispatch(action), [action.type, ...deps]);

  return { data, isLoading };
};
