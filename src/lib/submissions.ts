import { useEffect, useRef } from "react";
import { api } from "./api";

type Value = string | string[] | File[] | undefined;

/** Name of the hidden field only bots fill in. Matches RejectSpam::HONEYPOT. */
export const HONEYPOT_FIELD = "hp_extra_info";

/**
 * Sends one form to POST /api/submissions as multipart form data, so photos
 * travel with the answers. Resolves once the server has stored it.
 */
export async function sendSubmission(
  fields: Record<string, Value>,
  { elapsedMs, honeypot, onProgress }: { elapsedMs: number; honeypot: string; onProgress?: (percent: number) => void },
) {
  const body = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    if (Array.isArray(value)) value.forEach((item) => body.append(`${key}[]`, item));
    else if (value !== undefined) body.append(key, value);
  }
  body.append("source_page", currentPage());
  body.append("elapsed_ms", String(elapsedMs));
  body.append(HONEYPOT_FIELD, honeypot);

  await api.post("submissions", body, {
    // Photo uploads on a slow phone connection can take a while.
    timeout: 120_000,
    onUploadProgress: (event) => {
      if (onProgress && event.total) onProgress(Math.round((event.loaded / event.total) * 100));
    },
  });
}

/**
 * How long the form has been on screen. People take seconds; the server
 * discards submissions that arrive faster than any person could type.
 */
export function useFormTimer() {
  const openedAt = useRef(0);
  useEffect(() => {
    openedAt.current = performance.now();
  }, []);
  return () => Math.round(performance.now() - openedAt.current);
}

/** The page path without the deployment base path, e.g. "/services/roof-repair/". */
function currentPage() {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const path = window.location.pathname;
  return (base && path.startsWith(base) ? path.slice(base.length) : path) || "/";
}
