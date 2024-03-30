import React from "react";
import ReactDOM from "react-dom/client";
// import App from "./App.tsx";
import "./index.css";

let deferredPrompt: (Event & { prompt: () => Promise<void> }) | null = null;

deferPrompt();

const InstallButton = () => {
  const handleClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
    }
  };
  return (
    <>
      <button onClick={handleClick}>
        <h1>Install</h1>
      </button>
      ;
    </>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* <App /> */}
    <InstallButton />
  </React.StrictMode>
);

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/sw.js")
    .then(() => console.log("service worker registered"));
}

function deferPrompt() {
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    console.log("before install prevented...");
    deferredPrompt = event;
  });
}
