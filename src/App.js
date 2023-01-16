import { Provider } from "react-redux";
import React, { Suspense } from "react";
import { Router } from "react-router-dom";
import { ConnectedRouter } from "connected-react-router";

import Routes from "routes";

import store from "./app/store";
import { history } from "./routes/history";
import Spinner from "./components/@vuexy/spinner/Fallback-spinner";

function App() {
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Router history={history}>
          <Suspense fallback={<Spinner />}>
            <Routes />
          </Suspense>
        </Router>
      </ConnectedRouter>
    </Provider>
  );
}

export default App;
