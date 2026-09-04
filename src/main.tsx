import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

const container = document.getElementById("root")!;
const app = (
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// scripts/prerender-routes.mjs renders the homepage with react-dom/server
// (src/entry-server.tsx) and marks the root with data-ssr="1". That markup is
// the same tree React renders here, so hydrate it instead of wiping it: a
// createRoot().render() on top of server markup repaints the whole page
// (paint-then-replace was the CLS 0.759 regression in June 2026). Every other
// route still ships the shell with a small h1 + intro that React replaces.
if (container.dataset.ssr === "1") {
  ReactDOM.hydrateRoot(container, app);
} else {
  ReactDOM.createRoot(container).render(app);
}
