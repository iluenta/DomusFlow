"use client";

import { useActionState } from "react";

import { updatePasswordAction } from "@/app/actions/auth";
import { AuthAlert } from "@/components/auth/auth-alert";
import { PasswordInput } from "@/components/auth/password-input";
import { SubmitButton } from "@/components/auth/submit-button";
import { initialAuthFormState } from "@/lib/auth/types";

export function ResetPasswordForm() {
  const [state, formAction] = useActionState(
    updatePasswordAction,
    initialAuthFormState,
  );
  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="space-y-5" noValidate>
      {state.status === "error" && state.message ? (
        <AuthAlert variant="destructive">{state.message}</AuthAlert>
      ) : null}

      <PasswordInput
        name="password"
        label="Nueva contraseña"
        autoComplete="new-password"
        placeholder="Crea una contraseña nueva"
        hint="Mínimo 12 caracteres."
        error={errors.password}
      />

      <PasswordInput
        name="confirm_password"
        label="Repite la contraseña"
        autoComplete="new-password"
        placeholder="Repite la contraseña nueva"
        error={errors.confirm_password}
      />

      <SubmitButton pendingLabel="Guardando…">
        Guardar contraseña
      </SubmitButton>
    </form>
  );
}
