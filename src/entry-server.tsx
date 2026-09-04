import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import App from "./App";

/**
 * Build-time server render, used ONLY by scripts/prerender-routes.mjs.
 *
 * The homepage used to ship as an empty React shell plus a hand-written
 * h1 + one paragraph for no-JS crawlers (36 words, while /tjenester gave the
 * same crawlers 1 032 words). Expanding that hand-written block was tried
 * twice and reverted both times, because React's createRoot wiped #root on
 * mount and repainted the whole page (paint-then-replace, CLS 0.759 in the
 * June measurement).
 *
 * Rendering the real <App /> for the route instead gives crawlers exactly
 * the markup a user sees, and lets src/main.tsx hydrate that markup rather
 * than replace it, so nothing is repainted on mount. Same components, same
 * copy, same data modules: there is no crawler-specific content anywhere.
 */
export function render(url: string): string {
  return renderToString(
    <React.StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </React.StrictMode>,
  );
}
