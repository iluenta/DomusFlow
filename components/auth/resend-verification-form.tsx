"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { useFormStatus } from "react-dom";

import { resendVerificationAction } from "@/app/actions/auth";
import { AuthAlert } from "@/components/auth/auth-alert";
import { FieldError } from "@/components/auth/field-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { initialAuthFormState } from "@/lib/auth/types";
import { cn } from "cn";

function ResendButton({ cooldown }: { cooldown: number }) {
  const { pending } = useFormStatus();
  const disabled = pending || cooldown > 0;

  return (
    <Button
      type="submit"
      disabled={disabled}
      aria-busy={pending}
      className="h-11 w-full text-sm"
    >
      {pending
        ? "Enviando…"
        : cooldown > 0
          ? `Podrás reenviar en ${cooldown} s`
          : "Reenviar correo"}
    </Button>
  );
}

function ResendControls({
  initialCooldown,
}: {
  initialCooldown: number;
}) {
  const [cooldown, setCooldown] = useState(initialCooldown);

  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = window.setInterval(() => {
      setCooldown((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [cooldown]);

  return <ResendButton cooldown={cooldown} />;
}

export function ResendVerificationForm({
  initialEmail,
}: {
  initialEmail?: string;
}) {
  const [state, formAction] = useActionState(
    resendVerificationAction,
    initialAuthFormState,
  );
  const emailError = state.fieldErrors?.email;
  const successKey = state.status === "success" ? state.completedAt : undefined;

  return (
    <form action={formAction} className="space-y-5" noValidate>
      {state.status === "success" && state.message ? (
        <AuthAlert title="Correo enviado">{state.message}</AuthAlert>
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
          defaultValue={initialEmail}
          placeholder="tu@email.com"
          aria-invalid={emailError ? true : undefined}
          aria-describedby={emailError ? "email-error" : undefined}
          className={cn("h-11", emailError && "border-destructive")}
        />
        <FieldError id="email-error" message={emailError} />
      </div>

      <ResendControls
        key={successKey ?? "idle"}
        initialCooldown={successKey ? 60 : 0}
      />

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
