"use client";

import { useServerInsertedHTML } from "next/navigation";

const themeScript = `
(function () {
  try {
    var key = "hospyia-theme";
    var stored = window.localStorage.getItem(key);
    var theme = stored === "light" || stored === "dark" || stored === "system" ? stored : "system";
    var dark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    var root = document.documentElement;
    root.classList.toggle("dark", dark);
    root.style.colorScheme = dark ? "dark" : "light";
    var statusBar = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
    if (statusBar) statusBar.setAttribute("content", dark ? "black-translucent" : "default");
  } catch (error) {
    /* The app still renders in light mode if storage is blocked. */
  }
})();
`;

/**
 * Injects the no-flash theme script through Next's HTML stream instead of
 * rendering a <script> in the React tree (React 19 warns about the latter).
 */
export function ThemeInit() {
  useServerInsertedHTML(() => (
    <script
      id="hospyia-theme-init"
      dangerouslySetInnerHTML={{ __html: themeScript }}
    />
  ));

  return null;
}
