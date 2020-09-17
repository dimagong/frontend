import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import appSlice from "./slices/appSlice";
import createSagaMiddleware from 'redux-saga';
import rootSaga from "app/saga";
import vuexyReducer from 'app/reducers/vuexy/rootReducer'
import { connectRouter } from 'connected-react-router'
import {history} from '../history'

const sagaMiddleware = createSagaMiddleware();


const middleware = [
    ...getDefaultMiddleware({ thunk: false, serializableCheck: false, }),
    sagaMiddleware,
  ];

const store = configureStore({
  reducer: {
    app: appSlice,
    vuexy: vuexyReducer,
    router: connectRouter(history)
  },
  middleware
});

sagaMiddleware.run(rootSaga);

export default store;
