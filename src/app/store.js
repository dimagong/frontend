import createSagaMiddleware from "redux-saga";
import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { connectRouter, routerMiddleware } from "connected-react-router";

import rootSaga from "app/saga";

import { history } from "../history";
import appSlice from "./slices/appSlice";
import loadingReducer from "./loadingReducer.js";
import onboardingSlice from "./slices/onboardingSlice";

const sagaMiddleware = createSagaMiddleware();

const middleware = [
  ...getDefaultMiddleware({ thunk: false, serializableCheck: false }),
  sagaMiddleware,
  routerMiddleware(history),
];

const store = configureStore({
  reducer: {
    app: appSlice.reducer,
    onboarding: onboardingSlice.reducer,
    router: connectRouter(history),
    loading: loadingReducer,
  },
  middleware,
});

if (process.env.NODE_ENV === "development") {
  let currentValue;
  store.subscribe(() => {
    let previousValue = currentValue;
    currentValue = store.getState()?.app?.isError;

    previousValue !== currentValue && currentValue && console.error(currentValue);
  });
}

sagaMiddleware.run(rootSaga);

export default store;
