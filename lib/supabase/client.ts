import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

import { getSupabaseEnv } from "@/lib/env";

let browserClient: SupabaseClient | undefined;

/**
 * Browser client for future client-side features.
 * Auth mutations intentionally go through Server Actions.
 */
export function createClient(): SupabaseClient {
  if (browserClient) return browserClient;

  const { url, key } = getSupabaseEnv();
  browserClient = createBrowserClient(url, key, {
    cookieOptions: {
      sameSite: "lax",
      secure:
        typeof window !== "undefined" &&
        window.location.protocol === "https:",
    },
  });

  return browserClient;
}
