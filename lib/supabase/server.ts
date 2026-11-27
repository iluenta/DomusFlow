import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { getSupabaseEnv, isSecureSite } from "@/lib/env";

/**
 * Server-side Supabase client bound to the request cookies.
 * Create a new instance per request; never cache it in a module variable.
 */
export async function createClient() {
  const { url, key } = getSupabaseEnv();
  const cookieStore = await cookies();

  return createServerClient(url, key, {
    cookieOptions: {
      sameSite: "lax",
      secure: isSecureSite(),
    },
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components cannot write cookies. The proxy refreshes the
          // session and writes cookies on the response instead.
        }
      },
    },
  });
}
