import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { createLoadingSelector } from "app/selectors/loadingSelector";

export const useStoreMutation = (action) => {
  const dispatch = useDispatch();
  const isLoading = useSelector(createLoadingSelector([action.type], true));
  const mutate = React.useCallback((payload) => dispatch(action(payload)), [action, dispatch]);

  return { mutate, isLoading };
};
