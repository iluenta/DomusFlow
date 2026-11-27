"use server";

import { redirect } from "next/navigation";

import { authErrorMessage, isRateLimitError } from "@/lib/auth/errors";
import { safeNextPath } from "@/lib/auth/redirects";
import type { AuthFormState } from "@/lib/auth/types";
import {
  emailOnlySchema,
  fieldErrorsFromZod,
  loginSchema,
  registerSchema,
  updatePasswordSchema,
} from "@/lib/auth/validation";
import { getSiteUrl } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

type ServerSupabase = Awaited<ReturnType<typeof createClient>>;

function value(formData: FormData, key: string): string {
  const entry = formData.get(key);
  return typeof entry === "string" ? entry : "";
}

function configError(): AuthFormState {
  return {
    status: "error",
    message:
      "La autenticación no está configurada. Revisa las variables de Supabase.",
  };
}

function confirmationRedirect(): string {
  return `${getSiteUrl()}/auth/confirm`;
}

export async function loginAction(
  _previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = loginSchema.safeParse({
    email: value(formData, "email"),
    password: value(formData, "password"),
    next: value(formData, "next") || undefined,
  });

  if (!parsed.success) {
    return {
      status: "error",
      fieldErrors: fieldErrorsFromZod(parsed.error),
    };
  }

  let supabase: ServerSupabase;
  try {
    supabase = await createClient();
  } catch {
    return configError();
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return {
      status: "error",
      message: authErrorMessage(error),
    };
  }

  redirect(safeNextPath(parsed.data.next));
}

export async function registerAction(
  _previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = registerSchema.safeParse({
    full_name: value(formData, "full_name"),
    email: value(formData, "email"),
    password: value(formData, "password"),
    confirm_password: value(formData, "confirm_password"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      fieldErrors: fieldErrorsFromZod(parsed.error),
    };
  }

  let supabase: ServerSupabase;
  try {
    supabase = await createClient();
  } catch {
    return configError();
  }

  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        full_name: parsed.data.full_name,
      },
      emailRedirectTo: confirmationRedirect(),
    },
  });

  if (error) {
    console.warn("[auth] signup error", error.code, error.status);
    return {
      status: "error",
      message: authErrorMessage(error),
    };
  }

  // If email confirmation is disabled, signUp returns a session.
  if (data.session) {
    redirect("/dashboard");
  }

  redirect(`/verificar-email?email=${encodeURIComponent(parsed.data.email)}`);
}

export async function requestPasswordResetAction(
  _previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = emailOnlySchema.safeParse({
    email: value(formData, "email"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      fieldErrors: fieldErrorsFromZod(parsed.error),
    };
  }

  let supabase: ServerSupabase;
  try {
    supabase = await createClient();
  } catch {
    return configError();
  }

  const { error } = await supabase.auth.resetPasswordForEmail(
    parsed.data.email,
    {
      redirectTo: confirmationRedirect(),
    },
  );

  if (error && isRateLimitError(error)) {
    return {
      status: "error",
      message: authErrorMessage(error),
    };
  }

  // Always return the same message, even if the email does not exist.
  return {
    status: "success",
    message:
      "Si ese email está registrado, recibirás un enlace para restablecer la contraseña. Revisa también la carpeta de spam.",
  };
}

export async function resendVerificationAction(
  _previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = emailOnlySchema.safeParse({
    email: value(formData, "email"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      fieldErrors: fieldErrorsFromZod(parsed.error),
    };
  }

  let supabase: ServerSupabase;
  try {
    supabase = await createClient();
  } catch {
    return configError();
  }

  const { error } = await supabase.auth.resend({
    type: "signup",
    email: parsed.data.email,
    options: {
      emailRedirectTo: confirmationRedirect(),
    },
  });

  if (error && isRateLimitError(error)) {
    return {
      status: "error",
      message: authErrorMessage(error),
    };
  }

  return {
    status: "success",
    message:
      "Si la cuenta existe y aún no está verificada, te hemos enviado un nuevo correo.",
    completedAt: Date.now(),
  };
}

export async function updatePasswordAction(
  _previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = updatePasswordSchema.safeParse({
    password: value(formData, "password"),
    confirm_password: value(formData, "confirm_password"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      fieldErrors: fieldErrorsFromZod(parsed.error),
    };
  }

  let supabase: ServerSupabase;
  try {
    supabase = await createClient();
  } catch {
    return configError();
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      status: "error",
      message:
        "Tu enlace de recuperación ya no es válido. Solicita uno nuevo.",
    };
  }

  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (error) {
    return {
      status: "error",
      message: authErrorMessage(error),
    };
  }

  await supabase.auth.signOut({ scope: "global" });
  redirect("/login?estado=contrasena-actualizada");
}

export async function signOutAction(): Promise<void> {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } finally {
    redirect("/login?estado=sesion-cerrada");
  }
}
