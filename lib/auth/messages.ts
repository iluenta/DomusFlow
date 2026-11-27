export function loginNotice(
  estado?: string | null,
  error?: string | null,
): string | undefined {
  if (estado === "sesion-cerrada") {
    return "Has cerrado sesión correctamente.";
  }
  if (estado === "contrasena-actualizada") {
    return "Contraseña actualizada. Inicia sesión con tu nueva contraseña.";
  }
  if (estado === "bienvenida") {
    return "Tu cuenta está verificada. Bienvenido a Hospyia.";
  }
  if (error === "configuracion") {
    return "La autenticación no está configurada. Contacta con el administrador.";
  }
  if (error === "verificacion") {
    return "El enlace de verificación no es válido o ha caducado. Solicita uno nuevo.";
  }
  if (error === "sesion") {
    return "No hemos podido comprobar tu sesión. Vuelve a iniciar sesión.";
  }
  return undefined;
}

export function recoveryNotice(
  estado?: string | null,
): string | undefined {
  if (estado === "enlace-invalido") {
    return "El enlace de recuperación no es válido o ha caducado. Solicita uno nuevo.";
  }
  if (estado === "sesion-expirada") {
    return "Tu sesión de recuperación ha caducado. Solicita un enlace nuevo.";
  }
  return undefined;
}

export function authErrorCopy(motivo?: string | null): {
  title: string;
  description: string;
} {
  if (motivo === "enlace-caducado") {
    return {
      title: "El enlace ha caducado",
      description:
        "Por seguridad, los enlaces de acceso caducan. Solicita uno nuevo para continuar.",
    };
  }

  return {
    title: "El enlace no es válido",
    description:
      "Puede que ya se haya usado o que esté incompleto. Solicita uno nuevo para continuar.",
  };
}
