import React from "react";
import { BrowserRouter } from "react-router-dom";
import Routes from "routes";
import { history } from "./history";
import { ConnectedRouter } from "connected-react-router";

function App() {
  return (
    <BrowserRouter history={history}>
      <ConnectedRouter history={history}>
        <Routes />
      </ConnectedRouter>
    </BrowserRouter>
  );
}

export default App;
