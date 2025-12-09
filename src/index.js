import "@coreui/coreui/dist/css/coreui.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-app-polyfill/stable";
import "core-js";

import React from "react";
import ReactDOM from "react-dom/client"; // ✅ Updated import for React 18+
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { Provider } from "react-redux";
import axios from "axios";
import { store } from "./redux/store";

// -----------------------------
// Axios Setup
// -----------------------------
const setupAxios = () => {
  axios.defaults.baseURL = "http://localhost:5000"; // your local server
  axios.defaults.headers = {
    "Cache-Control": "no-cache,no-store",
    Pragma: "no-cache",
    Expires: "0",
  };
};

setupAxios();

// -----------------------------
// React 18+ App Rendering
// -----------------------------
const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement); // ✅ Updated

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

// -----------------------------
// Service Worker
// -----------------------------
serviceWorker.unregister();
