import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { getCurrentUser } from "@/lib/auth/user";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Nueva contraseña",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ResetPasswordPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/recuperar-contrasena?estado=enlace-invalido");
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs font-medium tracking-[0.14em] text-primary uppercase">
          Último paso
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">
          Crea una contraseña nueva
        </h1>
        <p className="text-sm leading-6 text-muted-foreground">
          Al guardarla cerraremos el resto de sesiones abiertas por seguridad.
        </p>
      </header>

      <ResetPasswordForm />
    </div>
  );
}
