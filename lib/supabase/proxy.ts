import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import {
  getSupabaseEnv,
  hasSupabaseEnv,
  isSecureSite,
} from "@/lib/env";

const LOGIN_PATH = "/login";
const RECOVERY_PATH = "/recuperar-contrasena";

function isProtectedPath(pathname: string): boolean {
  return pathname === "/dashboard" || pathname.startsWith("/dashboard/");
}

function isAuthEntryPath(pathname: string): boolean {
  return pathname === "/login" || pathname === "/registro";
}

function loginRedirect(
  request: NextRequest,
  params: Record<string, string>,
) {
  const target = request.nextUrl.clone();
  target.pathname = LOGIN_PATH;
  target.search = new URLSearchParams(params).toString();
  return NextResponse.redirect(target);
}

/**
 * Refreshes the Supabase session cookie and performs optimistic route checks.
 * Server Components still validate the user with `getUser()`.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });
  const pathname = request.nextUrl.pathname;

  if (!hasSupabaseEnv()) {
    if (isProtectedPath(pathname)) {
      return loginRedirect(request, { error: "configuracion" });
    }
    return supabaseResponse;
  }

  try {
    const { url, key } = getSupabaseEnv();
    const supabase = createServerClient(url, key, {
      cookieOptions: {
        sameSite: "lax",
        secure: isSecureSite(),
      },
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    });

    // Keep this immediately after creating the client. Do not insert code here:
    // it can make session refreshes hard to debug.
    const { data } = await supabase.auth.getClaims();
    const claims = data?.claims;
    const isAuthenticated = Boolean(claims?.sub);

    if (!isAuthenticated && isProtectedPath(pathname)) {
      const next = `${pathname}${request.nextUrl.search}`;
      return loginRedirect(request, { next });
    }

    if (!isAuthenticated && pathname === "/restablecer-contrasena") {
      const target = request.nextUrl.clone();
      target.pathname = RECOVERY_PATH;
      target.search = "?estado=enlace-invalido";
      return NextResponse.redirect(target);
    }

    if (isAuthenticated && isAuthEntryPath(pathname)) {
      const target = request.nextUrl.clone();
      target.pathname = "/dashboard";
      target.search = "";
      return NextResponse.redirect(target);
    }
  } catch {
    // A network or configuration error must not turn every page into a 500.
    if (isProtectedPath(pathname)) {
      return loginRedirect(request, {
        next: `${pathname}${request.nextUrl.search}`,
        error: "sesion",
      });
    }
  }

  return supabaseResponse;
}
