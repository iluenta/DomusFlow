import "server-only";

import { cache } from "react";
import { redirect, unstable_rethrow } from "next/navigation";
import type { User } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/server";

/**
 * Authoritative server-side session check. `getUser()` validates the token
 * against Supabase; never trust the proxy alone.
 */
export const getCurrentUser = cache(async (): Promise<User | null> => {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    return user;
  } catch (error) {
    // Never swallow Next.js control-flow errors (dynamic rendering, redirects).
    unstable_rethrow(error);

    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "[auth] No se pudo leer la sesión:",
        error instanceof Error ? error.message : "error desconocido",
      );
    }
    return null;
  }
});

export async function requireUser(
  nextPath = "/dashboard",
): Promise<User> {
  const user = await getCurrentUser();
  if (!user) {
    redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  }
  return user;
}
