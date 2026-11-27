import "server-only";

import { cache } from "react";
import { unstable_rethrow } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";

/**
 * Reads only the signed-in user's profile. RLS is the final authority; the
 * explicit `id` filter keeps the intent clear and the query cheap.
 */
export const getProfile = cache(
  async (userId: string): Promise<Profile | null> => {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, created_at, updated_at")
        .eq("id", userId)
        .maybeSingle();

      if (error) return null;
      return data;
    } catch (error) {
      unstable_rethrow(error);
      return null;
    }
  },
);

export function displayName(
  profile: Profile | null,
  email: string | undefined,
  metadataName?: unknown,
): string {
  if (profile?.full_name) return profile.full_name;

  if (typeof metadataName === "string" && metadataName.trim()) {
    return metadataName.trim();
  }

  if (email) return email.split("@")[0] ?? email;
  return "Hospyia";
}
