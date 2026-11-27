type SupabaseErrorLike = {
  code?: string | null;
  message?: string | null;
  status?: number | null;
} | null;

const MESSAGES: Record<string, string> = {
  invalid_credentials: "Email o contraseña incorrectos.",
  email_not_confirmed:
    "Confirma tu correo antes de iniciar sesión. Revisa tu bandeja de entrada.",
  over_email_send_rate_limit:
    "Hemos enviado demasiados correos. Espera antes de reintentar o configura un SMTP propio.",
  over_request_rate_limit:
    "Demasiadas solicitudes. Espera un minuto e inténtalo de nuevo.",
  weak_password:
    "La contraseña no cumple los requisitos de seguridad. Usa al menos 12 caracteres.",
  same_password:
    "La nueva contraseña debe ser distinta de la que usabas antes.",
  session_not_found: "Tu sesión ha caducado. Inicia sesión de nuevo.",
  refresh_token_not_found: "Tu sesión ha caducado. Inicia sesión de nuevo.",
  user_not_found: "Email o contraseña incorrectos.",
  signup_disabled: "El registro está desactivado en este momento.",
  email_provider_disabled: "El acceso por email no está disponible.",
  validation_failed: "Revisa los datos del formulario.",
  user_already_exists:
    "Si ya tienes cuenta, inicia sesión o recupera tu contraseña.",
};

export function authErrorMessage(error: SupabaseErrorLike): string {
  if (!error) return "No hemos podido completar la operación. Inténtalo de nuevo.";

  if (error.code && MESSAGES[error.code]) {
    return MESSAGES[error.code];
  }

  if (error.status === 429) {
    return MESSAGES.over_request_rate_limit;
  }

  const message = error.message?.toLowerCase() ?? "";

  if (message.includes("invalid login credentials")) {
    return MESSAGES.invalid_credentials;
  }
  if (message.includes("email not confirmed")) {
    return MESSAGES.email_not_confirmed;
  }
  if (message.includes("rate limit") || message.includes("too many")) {
    return MESSAGES.over_request_rate_limit;
  }
  if (message.includes("weak password") || message.includes("password should")) {
    return MESSAGES.weak_password;
  }
  if (message.includes("user already registered")) {
    return MESSAGES.user_already_exists;
  }

  return "No hemos podido completar la operación. Inténtalo de nuevo.";
}

export function isRateLimitError(error: SupabaseErrorLike): boolean {
  if (!error) return false;

  const code = error.code ?? "";
  const message = error.message?.toLowerCase() ?? "";

  return (
    error.status === 429 ||
    code.includes("rate_limit") ||
    message.includes("rate limit") ||
    message.includes("too many")
  );
}
