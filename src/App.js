import "react-toastify/dist/ReactToastify.css";
import "assets/scss/plugins/extensions/toastr.scss";

import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { QueryClientProvider } from "react-query";
import { ConnectedRouter } from "connected-react-router";
import { ReactQueryDevtools } from "react-query/devtools";

import Routes from "routes";
import authService from "services/auth";
import appSlice from "app/slices/appSlice";
import { queryClient } from "api/queryClient";

import { history } from "./history";

const { getProfileRequest } = appSlice.actions;

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    authService.getToken() && dispatch(getProfileRequest());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ConnectedRouter history={history}>
        <Router history={history}>
          <Routes />
        </Router>
        <ToastContainer />
      </ConnectedRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
