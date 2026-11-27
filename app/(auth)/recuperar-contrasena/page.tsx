import type { Metadata } from "next";

import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { recoveryNotice } from "@/lib/auth/messages";
import { first, type SearchParams } from "@/lib/search-params";

export const metadata: Metadata = {
  title: "Recuperar contraseña",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const notice = recoveryNotice(first(params.estado));

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs font-medium tracking-[0.14em] text-primary uppercase">
          Recupera el acceso
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">
          ¿Olvidaste tu contraseña?
        </h1>
        <p className="text-sm leading-6 text-muted-foreground">
          Escribe tu email y te enviaremos un enlace para crear una nueva.
        </p>
      </header>

      <ForgotPasswordForm notice={notice} />
    </div>
  );
}
