import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
// import { InstallButton } from "./InstallButton";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
    {/* <InstallButton /> */}
  </React.StrictMode>
);

if ("serviceWorker" in navigator) {
  console.log("registering service worker");
  navigator.serviceWorker
    .register("/sw.js")
    .then(() => console.log("service worker registered..."));
}
