import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { IntlProviderWrapper } from "./utility/context/Internationalization";
import { Layout } from "./utility/context/Layout";
import store from "./app/store";
import Spinner from "./components/@vuexy/spinner/Fallback-spinner";
import "assets/styles/index.scss";
import "react-toastify/dist/ReactToastify.css"
import "assets/scss/plugins/extensions/toastr.scss"
import "assets/scss/pages/authentication.scss"
import "assets/scss/plugins/tables/_agGridStyleOverride.scss";
import "flatpickr/dist/themes/light.css";
import "assets/scss/plugins/forms/flatpickr/flatpickr.scss";
import "assets/scss/pages/users.scss"
import "assets/scss/pages/coming-soon.scss"
import "./components/@vuexy/rippleButton/RippleButton"
import "react-perfect-scrollbar/dist/css/styles.css"
import "prismjs/themes/prism-tomorrow.css"
// import * as serviceWorker from './serviceWorker';

const LazyApp = lazy(() => import("./App"));

ReactDOM.render(
  <React.StrictMode>
      <Provider store={store}>
        <Suspense fallback={<Spinner />}>
          <Layout>
            <IntlProviderWrapper>
              <LazyApp />
            </IntlProviderWrapper>
          </Layout>
        </Suspense>
      </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
