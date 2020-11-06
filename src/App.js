import React, { useEffect } from "react";
import { Router } from "react-router-dom";
import Routes from "routes";
import { history } from "./history";
import { ConnectedRouter } from "connected-react-router";
import { useDispatch } from "react-redux";
import authService from "services/auth";
import { getProfileRequest } from "app/slices/appSlice";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    authService.getToken() && dispatch(getProfileRequest());
  }, []);

  return (
    <ConnectedRouter history={history}>
      <Router history={history}>
        <Routes />
      </Router>
    </ConnectedRouter>
  );
}

export default App;
