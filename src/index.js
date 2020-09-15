import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Auth0Provider } from "./authServices/auth0/auth0Service";
import config from "./authServices/auth0/auth0Config.json";
import { IntlProviderWrapper } from "./utility/context/Internationalization";
import { Layout } from "./utility/context/Layout";
import store from "./app/store";
import Spinner from "./components/@vuexy/spinner/Fallback-spinner";
import "bootstrap/dist/css/bootstrap.css";
import "assets/styles/index.scss";
import "react-toastify/dist/ReactToastify.css"
import "assets/scss/plugins/extensions/toastr.scss"
import "assets/scss/pages/authentication.scss"

// import * as serviceWorker from './serviceWorker';

const LazyApp = lazy(() => import("./App"));

ReactDOM.render(
  <React.StrictMode>
    <Auth0Provider
      domain={config.domain}
      client_id={config.clientId}
      redirect_uri={window.location.origin + process.env.REACT_APP_PUBLIC_PATH}
    >
      <Provider store={store}>
        <Suspense fallback={<Spinner />}>
          <Layout>
            <IntlProviderWrapper>
              <LazyApp />
            </IntlProviderWrapper>
          </Layout>
        </Suspense>
      </Provider>
    </Auth0Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
