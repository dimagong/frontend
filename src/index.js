import "assets/styles/new_index.scss";
import "react-toastify/dist/ReactToastify.css";

import React from "react";
import ReactDOM from "react-dom";
import { ToastContainer } from "react-toastify";
import { QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

import "./antConfig";
import App from "./App";
import { queryClient } from "./api/queryClient";

ReactDOM.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />

      <ToastContainer />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
