import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import appSlice from "./slices/appSlice";
import createSagaMiddleware from 'redux-saga';
import rootSaga from "app/saga";


const sagaMiddleware = createSagaMiddleware();


const middleware = [
    ...getDefaultMiddleware({ thunk: false, serializableCheck: false, }),
    sagaMiddleware,
  ];

const store = configureStore({
  reducer: {
    app: appSlice,
  },
  middleware
});

sagaMiddleware.run(rootSaga);

export default store;
