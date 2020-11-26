import React, { useEffect } from "react";
import { Router } from "react-router-dom";
import Routes from "routes";
import { history } from "./history";
import { ConnectedRouter } from "connected-react-router";
import { useDispatch } from "react-redux";
import authService from "services/auth";
import { getProfileRequest } from "app/slices/appSlice";
import classnames from 'classnames'
import PerfectScrollbar from 'react-perfect-scrollbar'

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    authService.getToken() && dispatch(getProfileRequest());
  }, []);

  return (
    <ConnectedRouter history={history}>
      <Router history={history}>
        <PerfectScrollbar>
          <Routes />
        </PerfectScrollbar>
      </Router>
    </ConnectedRouter>
  );
}

export default App;
