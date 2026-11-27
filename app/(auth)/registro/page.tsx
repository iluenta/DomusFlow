import type { Metadata } from "next";

import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Crear cuenta",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RegisterPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs font-medium tracking-[0.14em] text-primary uppercase">
          Empieza ahora
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">Crea tu cuenta</h1>
        <p className="text-sm leading-6 text-muted-foreground">
          Te enviaremos un correo para verificar tu dirección.
        </p>
      </header>

      <RegisterForm />
    </div>
  );
}
