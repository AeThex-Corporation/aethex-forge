/**
 * Get the API base URL
 * Always uses window.location.origin since the API is served from the same origin
 * This works for both development (localhost:8080) and production (aethex.dev)
 */
export function getApiBase(): string {
  if (typeof window === "undefined") {
    return "";
  }
  return window.location.origin;
}
