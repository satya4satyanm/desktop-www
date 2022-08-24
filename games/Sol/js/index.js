import React from "react";
import ReactDOM from "react-dom";

import App from "./App";

document.addEventListener("contextmenu", function (e) {
  e.preventDefault();
});

const rootElement = document.getElementById("root");
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  rootElement
);
