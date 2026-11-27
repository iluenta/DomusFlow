import Link from "next/link";
import type { Metadata } from "next";

import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Página no encontrada",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <main
      id="contenido"
      className="flex min-h-dvh flex-col items-center justify-center px-6 py-16"
    >
      <div className="w-full max-w-md text-center">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <p className="text-sm font-medium text-primary">Error 404</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">
          No encontramos esta página
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          La dirección no existe o ya no está disponible.
        </p>
        <Button
          render={<Link href="/login" />}
          size="lg"
          className="mt-8 h-11 px-5"
        >
          Ir al acceso
        </Button>
      </div>
    </main>
  );
}
