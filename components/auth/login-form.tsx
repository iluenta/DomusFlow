"use client";

import { useActionState } from "react";
import Link from "next/link";

import { loginAction } from "@/app/actions/auth";
import { AuthAlert } from "@/components/auth/auth-alert";
import { FieldError } from "@/components/auth/field-error";
import { PasswordInput } from "@/components/auth/password-input";
import { SubmitButton } from "@/components/auth/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { initialAuthFormState } from "@/lib/auth/types";
import { cn } from "cn";

export function LoginForm({
  next,
  notice,
}: {
  next: string;
  notice?: string;
}) {
  const [state, formAction] = useActionState(
    loginAction,
    initialAuthFormState,
  );
  const emailError = state.fieldErrors?.email;
  const passwordError = state.fieldErrors?.password;

  return (
    <form action={formAction} className="space-y-5" noValidate>
      <input type="hidden" name="next" value={next} />

      {notice ? <AuthAlert>{notice}</AuthAlert> : null}
      {state.status === "error" && state.message ? (
        <AuthAlert variant="destructive">{state.message}</AuthAlert>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          placeholder="tu@email.com"
          aria-invalid={emailError ? true : undefined}
          aria-describedby={emailError ? "email-error" : undefined}
          className={cn("h-11", emailError && "border-destructive")}
        />
        <FieldError id="email-error" message={emailError} />
      </div>

      <PasswordInput
        name="password"
        label="Contraseña"
        autoComplete="current-password"
        placeholder="Tu contraseña"
        error={passwordError}
        action={
          <Link
            href="/recuperar-contrasena"
            className="inline-flex min-h-11 items-center text-xs font-medium text-primary underline-offset-4 hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        }
      />

      <SubmitButton pendingLabel="Entrando…">Entrar</SubmitButton>

      <p className="text-center text-sm text-muted-foreground">
        ¿Aún no tienes cuenta?{" "}
        <Link
          href="/registro"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Crear una cuenta
        </Link>
      </p>
    </form>
  );
}
