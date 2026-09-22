import { useSyncExternalStore } from "react";

const listeners = new Set<() => void>();

const subscribe = (onChange: () => void) => {
  listeners.add(onChange);
  window.addEventListener("popstate", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("popstate", onChange);
  };
};

/**
 * One query-string value, read in the browser. The static export has no
 * query at build time, so the prerendered HTML sees null and the page
 * updates once it runs, without a hydration mismatch. Back and Forward
 * update it too.
 */
export function useQueryParam(name: string): string | null {
  return useSyncExternalStore(
    subscribe,
    () => new URLSearchParams(window.location.search).get(name),
    () => null,
  );
}

/**
 * Change one query-string value without a navigation. "push" adds a history
 * entry, so Back undoes it. Next.js keeps its router in step with native
 * pushState/replaceState calls.
 */
export function setQueryParam(name: string, value: string | null, mode: "push" | "replace" = "push") {
  const url = new URL(window.location.href);
  if (value === null) url.searchParams.delete(name);
  else url.searchParams.set(name, value);
  if (url.href === window.location.href) return;
  window.history[mode === "push" ? "pushState" : "replaceState"](window.history.state, "", url);
  listeners.forEach((listener) => listener());
}
