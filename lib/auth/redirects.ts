export const DEFAULT_AUTH_REDIRECT = "/dashboard";

/**
 * Only allow same-origin, absolute-path redirects.
 * Rejects protocol-relative URLs, backslashes and external origins.
 */
export function safeNextPath(
  value: string | null | undefined,
  fallback = DEFAULT_AUTH_REDIRECT,
): string {
  if (!value) return fallback;
  if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\")) {
    return fallback;
  }

  try {
    const base = "https://hospyia.invalid";
    const url = new URL(value, base);
    if (url.origin !== base) return fallback;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
}
