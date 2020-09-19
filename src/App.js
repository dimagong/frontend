import React, { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
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
      <BrowserRouter history={history}>
        <Routes />
      </BrowserRouter>
    </ConnectedRouter>
  );
}

export default App;
