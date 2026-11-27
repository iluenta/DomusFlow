import type { Metadata } from "next";
import { LockKeyhole } from "lucide-react";

import { LoginForm } from "@/components/auth/login-form";
import { loginNotice } from "@/lib/auth/messages";
import { safeNextPath } from "@/lib/auth/redirects";
import { first, type SearchParams } from "@/lib/search-params";

export const metadata: Metadata = {
  title: "Iniciar sesión",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const next = safeNextPath(first(params.next));
  const notice = loginNotice(first(params.estado), first(params.error));

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs font-medium tracking-[0.14em] text-primary uppercase">
          Bienvenido de nuevo
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">Inicia sesión</h1>
        <p className="text-sm leading-6 text-muted-foreground">
          Accede a tu panel de Hospyia.
        </p>
      </header>

      <LoginForm next={next} notice={notice} />

      <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
        <LockKeyhole aria-hidden="true" className="size-3.5" />
        Conexión segura y sesión protegida.
      </p>
    </div>
  );
}
