import React from "react";
import ReactDOM from "react-dom";
import { css } from "./infra";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

css.tag("body", {
  margin: 0,
  fontFamily: `Roboto, "Source Sans Pro", "Trebuchet MS", "Lucida Grande", "Bitstream Vera Sans", "Helvetica Neue", sans-serif`,
});

css.selector("*", {
  boxSizing: "border-box",
});

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
