import _ from "lodash/fp";
import React from "react";
import { isObservable, Subject, takeUntil, tap, catchError } from "rxjs";

import { useFreshFn } from "./useFreshRef";

const Status = {
  Idle: Symbol("useAsync#Idle"),
  Pending: Symbol("useAsync#Pending"),
  Rejected: Symbol("useAsync#Rejected"),
  Resolved: Symbol("useAsync#Resolved"),
};

const INITIAL_STATE = { data: null, error: null, status: Status.Idle };

export const useAsync = ({ useObservable } = { useObservable: false }) => {
  const destroy$Ref = React.useRef(new Subject());

  const [{ data, error, status }, setState] = React.useReducer((s, p) => ({ ...s, ...p }), INITIAL_STATE);

  const safeSetState = useFreshFn(setState);

  const setData = React.useCallback((data) => safeSetState({ data, status: Status.Resolved }), [safeSetState]);

  const setError = React.useCallback((error) => safeSetState({ error, status: Status.Rejected }), [safeSetState]);

  const setPending = React.useCallback(() => safeSetState({ status: Status.Pending }), [safeSetState]);

  const setInitial = React.useCallback((error) => safeSetState(INITIAL_STATE), [safeSetState]);

  const run = React.useCallback(
    useObservable
      ? (observable) => {
          if (!isObservable(observable)) {
            console.error("The result of 'run' is not a observable like.");
            return;
          }

          setPending();
          return observable.pipe(
            takeUntil(destroy$Ref.current),
            tap(setData),
            catchError((error) => {
              setError(error);
              throw error;
            })
          );
        }
      : (promise) => {
          if (!_.isFunction(promise.then)) {
            console.error("The result of 'run' is not a promise like.");
            return;
          }

          setPending();

          return promise.then(setData, setError);
        },
    [setData, setError, setPending]
  );

  React.useEffect(
    () => () => {
      destroy$Ref.current.next();
      destroy$Ref.current.complete();
    },
    []
  );

  return [
    {
      data,
      error,
      status,
      isIdle: status === Status.Idle,
      isError: status === Status.Rejected,
      isLoading: status === Status.Pending,
      isResolved: status === Status.Resolved,
      setInitial,
    },
    run,
  ];
};

useAsync.Status = Status;
