import "react-toastify/dist/ReactToastify.css";
import "assets/scss/plugins/extensions/toastr.scss";

import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Scrollbars } from "react-custom-scrollbars";
import { ConnectedRouter } from "connected-react-router";

import Routes from "routes";
import authService from "services/auth";
import appSlice from "app/slices/appSlice";

import { history } from "./history";

const { getProfileRequest } = appSlice.actions;

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    authService.getToken() && dispatch(getProfileRequest());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ConnectedRouter history={history}>
      <Router history={history}>
        <Scrollbars className={"scrollbar-container"}>
          <Routes />
        </Scrollbars>
      </Router>
      <ToastContainer />
    </ConnectedRouter>
  );
}

export default App;
