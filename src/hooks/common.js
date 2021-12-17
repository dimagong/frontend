import { useEffect, useRef } from 'react';

import { useSelector } from "react-redux";
import { createLoadingSelector } from "app/selectors/loadingSelector";
import { selectError } from "app/selectors";

// Store the previous value of variable that was passed to that hook
export const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

export const useCallbackOnLoad = (actionType, callback, isPreloadRequired) => {

  const actionLoadingSelector = useSelector(createLoadingSelector([actionType], isPreloadRequired));
  const prevActionLoadingState = usePrevious(actionLoadingSelector);
  const error = useSelector(selectError);

  useEffect(() => {
    if (!error && !actionLoadingSelector && prevActionLoadingState === true) {
      callback()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionLoadingSelector]);

  return actionLoadingSelector;
};
