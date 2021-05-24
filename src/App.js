import React, { useEffect } from "react";
import { Router } from "react-router-dom";
import Routes from "routes";
import { history } from "./history";
import { ConnectedRouter } from "connected-react-router";
import { useDispatch } from "react-redux";
import authService from "services/auth";
import {ToastContainer} from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"
import "assets/scss/plugins/extensions/toastr.scss"

import { Scrollbars } from 'react-custom-scrollbars';

import appSlice from 'app/slices/appSlice'

const {getProfileRequest} = appSlice.actions;


function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    authService.getToken() && dispatch(getProfileRequest());
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
