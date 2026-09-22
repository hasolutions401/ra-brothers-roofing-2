import axios, { isAxiosError } from "axios";

/**
 * Base URL of the Laravel API, fixed at build time from API_URL (see
 * src/lib/deployment.mjs): "/api" when the API shares the site's domain.
 * Empty on builds without a backend, such as the GitHub Pages demo; the
 * forms then stay in preview mode and the dashboard says it is unavailable.
 */
export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
export const API_ENABLED = API_URL !== "";

/**
 * One client for the whole site. The dashboard signs in with Laravel's
 * session cookie (httpOnly, so no script can read it) and sends the CSRF
 * token axios copies from the XSRF-TOKEN cookie. No token is ever stored
 * by this code.
 */
export const api = axios.create({
  baseURL: `${API_URL}/`,
  withCredentials: true,
  // Also send the CSRF header in local development, where the API runs on
  // another port and so counts as a different origin.
  withXSRFToken: true,
  headers: { Accept: "application/json", "X-Requested-With": "XMLHttpRequest" },
  timeout: 30_000,
});

// Free hosts can answer with an HTML page (a browser check or an error
// page) instead of the API's JSON. Treat that as a failure, not success.
api.interceptors.response.use((response) => {
  const expectsJson = !response.config.responseType || response.config.responseType === "json";
  if (expectsJson && response.status !== 204 && typeof response.data === "string" && response.data !== "") {
    return Promise.reject(new UnexpectedResponse());
  }
  return response;
});

class UnexpectedResponse extends Error {}

export type Problem = {
  kind: "validation" | "rate-limit" | "signed-out" | "too-large" | "offline" | "server";
  /** A sentence to show the visitor. */
  message: string;
  /** First message for each field the server rejected, keyed by API field name. */
  fields: Record<string, string>;
};

/** Every failed request, whatever went wrong, as something a form can show. */
export function toProblem(error: unknown): Problem {
  const none = {};
  if (!isAxiosError(error) || !error.response) {
    return error instanceof UnexpectedResponse || (isAxiosError(error) && error.code === "ECONNABORTED")
      ? { kind: "server", message: "The server did not answer properly. Please try again in a minute.", fields: none }
      : { kind: "offline", message: "We could not reach the server. Check your connection and try again.", fields: none };
  }

  const { status, data } = error.response;
  const message = typeof data?.message === "string" ? data.message : "";

  if (status === 422) {
    const fields = Object.fromEntries(
      Object.entries((data?.errors ?? {}) as Record<string, string[]>).map(([field, messages]) => [field, messages[0]]),
    );
    return { kind: "validation", message: message || "Please check the highlighted answers.", fields };
  }
  if (status === 429) return { kind: "rate-limit", message: message || "Too many attempts. Please wait a few minutes.", fields: none };
  if (status === 401 || status === 419) return { kind: "signed-out", message: "Your session has ended. Please sign in again.", fields: none };
  if (status === 413) return { kind: "too-large", message: message || "That was too large to send. Try fewer photos.", fields: none };
  return { kind: "server", message: "Something went wrong on our side. Please try again in a minute.", fields: none };
}
