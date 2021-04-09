import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import appSlice from "./slices/appSlice";
import onboardingSlice from "./slices/onboardingSlice";
import createSagaMiddleware from 'redux-saga';
import rootSaga from "app/saga";
import vuexyReducer from 'app/reducers/vuexy/rootReducer'
import { connectRouter, routerMiddleware } from 'connected-react-router'
import {history} from '../history'

import loadingReducer from './loadingReducer.js'

const sagaMiddleware = createSagaMiddleware();


const middleware = [
    ...getDefaultMiddleware({ thunk: false, serializableCheck: false, }),
    sagaMiddleware,
    routerMiddleware(history)
  ];

const store = configureStore({
  reducer: {
    app: appSlice.reducer,
    onboarding: onboardingSlice.reducer,
    vuexy: vuexyReducer,
    router: connectRouter(history),
    loading: loadingReducer,
  },
  middleware
});

sagaMiddleware.run(rootSaga);

export default store;
