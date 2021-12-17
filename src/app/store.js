import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import appSlice from "./slices/appSlice";
import onboardingSlice from "./slices/onboardingSlice";
import createSagaMiddleware from "redux-saga";
import rootSaga from "app/saga";
import vuexyReducer from "app/reducers/vuexy/rootReducer";
import { connectRouter, routerMiddleware } from "connected-react-router";
import { history } from "../history";

import loadingReducer from "./loadingReducer.js";

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
    vuexy: vuexyReducer,
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

    previousValue !== currentValue && currentValue && console.error(currentValue.name, currentValue);
  });
}

sagaMiddleware.run(rootSaga);

export default store;
