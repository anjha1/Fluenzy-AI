"use client";

import { useEffect } from "react";

export default function PWARegister() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      (window as Window & { __fluenzyInstallPrompt?: Event }).__fluenzyInstallPrompt = event;
      window.dispatchEvent(new CustomEvent("fluenzyai:beforeinstallprompt", { detail: event }));
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    const registerSW = async () => {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        });

        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (!newWorker) return;
          newWorker.addEventListener("statechange", () => {
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              // New version available — reload to activate
              console.log("[PWA] New version available, reloading…");
              window.location.reload();
            }
          });
        });
      } catch (err) {
        console.warn("[PWA] Service worker registration failed:", err);
      }
    };

    registerSW();

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  return null;
}
