"use client";

import { useEffect } from "react";

/**
 * The service worker only handles static assets and the offline fallback.
 * It is never used to cache authenticated HTML or data.
 */
export function PwaRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    if (process.env.NODE_ENV !== "production") {
      // Remove stale workers while developing so changes are visible.
      void navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          void registration.unregister();
        });
      });
      return;
    }

    void navigator.serviceWorker
      .register("/sw.js", {
        scope: "/",
        updateViaCache: "none",
      })
      .catch((error: unknown) => {
        console.warn(
          "[pwa] No se pudo registrar el service worker:",
          error instanceof Error ? error.message : "error desconocido",
        );
      });
  }, []);

  return null;
}
