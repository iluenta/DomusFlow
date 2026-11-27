"use client";

import { useActionState } from "react";
import Link from "next/link";

import { registerAction } from "@/app/actions/auth";
import { AuthAlert } from "@/components/auth/auth-alert";
import { FieldError } from "@/components/auth/field-error";
import { PasswordInput } from "@/components/auth/password-input";
import { SubmitButton } from "@/components/auth/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { initialAuthFormState } from "@/lib/auth/types";
import { cn } from "cn";

export function RegisterForm() {
  const [state, formAction] = useActionState(
    registerAction,
    initialAuthFormState,
  );
  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="space-y-5" noValidate>
      {state.status === "error" && state.message ? (
        <AuthAlert variant="destructive">{state.message}</AuthAlert>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="full_name">Nombre</Label>
        <Input
          id="full_name"
          name="full_name"
          type="text"
          autoComplete="name"
          autoCapitalize="words"
          placeholder="Tu nombre"
          aria-invalid={errors.full_name ? true : undefined}
          aria-describedby={errors.full_name ? "full_name-error" : undefined}
          className={cn("h-11", errors.full_name && "border-destructive")}
        />
        <FieldError id="full_name-error" message={errors.full_name} />
      </div>

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
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? "email-error" : undefined}
          className={cn("h-11", errors.email && "border-destructive")}
        />
        <FieldError id="email-error" message={errors.email} />
      </div>

      <PasswordInput
        name="password"
        label="Contraseña"
        autoComplete="new-password"
        placeholder="Crea una contraseña"
        hint="Mínimo 12 caracteres. Mejor una frase larga y única."
        error={errors.password}
      />

      <PasswordInput
        name="confirm_password"
        label="Repite la contraseña"
        autoComplete="new-password"
        placeholder="Repite la contraseña"
        error={errors.confirm_password}
      />

      <SubmitButton pendingLabel="Creando cuenta…">
        Crear cuenta
      </SubmitButton>

      <p className="text-center text-sm text-muted-foreground">
        ¿Ya tienes cuenta?{" "}
        <Link
          href="/login"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Iniciar sesión
        </Link>
      </p>
    </form>
  );
}
