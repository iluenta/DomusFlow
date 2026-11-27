"use client";

import { useActionState } from "react";
import Link from "next/link";

import { requestPasswordResetAction } from "@/app/actions/auth";
import { AuthAlert } from "@/components/auth/auth-alert";
import { FieldError } from "@/components/auth/field-error";
import { SubmitButton } from "@/components/auth/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { initialAuthFormState } from "@/lib/auth/types";
import { cn } from "cn";

export function ForgotPasswordForm({
  notice,
}: {
  notice?: string;
}) {
  const [state, formAction] = useActionState(
    requestPasswordResetAction,
    initialAuthFormState,
  );
  const emailError = state.fieldErrors?.email;

  return (
    <form action={formAction} className="space-y-5" noValidate>
      {notice ? <AuthAlert>{notice}</AuthAlert> : null}
      {state.status === "success" && state.message ? (
        <AuthAlert title="Revisa tu correo">{state.message}</AuthAlert>
      ) : null}
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

      <SubmitButton pendingLabel="Enviando…">Enviar enlace</SubmitButton>

      <p className="text-center text-sm text-muted-foreground">
        <Link
          href="/login"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Volver al acceso
        </Link>
      </p>
    </form>
  );
}
