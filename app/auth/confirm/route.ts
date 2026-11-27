import { type EmailOtpType } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { NextResponse, type NextRequest } from "next/server";

import { safeNextPath } from "@/lib/auth/redirects";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const code = searchParams.get("code");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = safeNextPath(searchParams.get("next"), "/dashboard");

  if (!tokenHash && !code) {
    return NextResponse.redirect(
      new URL("/auth/error?motivo=enlace-invalido", request.url),
    );
  }

  let verified = false;

  try {
    const supabase = await createClient();

    if (tokenHash && type) {
      const { error } = await supabase.auth.verifyOtp({
        type,
        token_hash: tokenHash,
      });
      verified = !error;
    } else if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      verified = !error;
    }
  } catch {
    return NextResponse.redirect(
      new URL("/login?error=configuracion", request.url),
    );
  }

  if (verified) {
    // Next attaches the cookies written by the Supabase server client to the
    // redirect response. Use next/navigation redirect, not NextResponse.redirect.
    redirect(next);
  }

  return NextResponse.redirect(
    new URL("/auth/error?motivo=enlace-caducado", request.url),
  );
}
