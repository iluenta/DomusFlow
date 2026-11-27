const DEFAULT_SITE_URL = "http://localhost:3000";

/**
 * Canonical origin used for metadata and email redirects.
 * Falls back to localhost so `next build` works without secrets.
 */
export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return DEFAULT_SITE_URL;

  try {
    const url = new URL(raw);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return DEFAULT_SITE_URL;
    }
    return url.origin;
  } catch {
    return DEFAULT_SITE_URL;
  }
}

/**
 * Only mark cookies as Secure when the configured canonical URL is HTTPS.
 * This keeps `next start` usable over http://localhost while production
 * (https://hospyia.com) gets Secure cookies.
 */
export function isSecureSite(): boolean {
  return getSiteUrl().startsWith("https://");
}

export type SupabasePublicEnv = {
  url: string;
  key: string;
};

export function hasSupabaseEnv(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  );
}

/**
 * Public Supabase credentials. Safe to expose: access is constrained by RLS.
 * Never put the secret/service-role key here.
 */
export function getSupabaseEnv(): SupabasePublicEnv {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )?.trim();

  if (!url || !key) {
    throw new Error(
      "Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY. Revisa .env.local.",
    );
  }

  return { url, key };
}
