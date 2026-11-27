import type { Metadata } from "next";
import { Mail } from "lucide-react";

import { ResendVerificationForm } from "@/components/auth/resend-verification-form";
import { first, type SearchParams } from "@/lib/search-params";

export const metadata: Metadata = {
  title: "Verifica tu email",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const email = first(params.email);

  return (
    <div className="space-y-6">
      <header className="space-y-3">
        <div className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Mail aria-hidden="true" className="size-5" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Revisa tu correo
        </h1>
        <p className="text-sm leading-6 text-muted-foreground">
          {email ? (
            <>
              Hemos enviado un enlace de verificación a{" "}
              <span className="font-medium text-foreground">{email}</span>. Ábrelo
              para activar tu cuenta.
            </>
          ) : (
            "Hemos enviado un enlace de verificación a tu correo. Ábrelo para activar tu cuenta."
          )}
        </p>
      </header>

      <ResendVerificationForm initialEmail={email} />

      <p className="text-xs leading-5 text-muted-foreground">
        Si no lo ves en unos minutos, revisa la carpeta de spam. El enlace caduca
        por seguridad y solo puede usarse una vez.
      </p>
    </div>
  );
}
