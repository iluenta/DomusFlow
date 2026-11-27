"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app] Error de renderizado", error.digest ?? "sin digest");
  }, [error]);

  return (
    <main
      id="contenido"
      className="flex min-h-dvh flex-col items-center justify-center px-6 py-16"
    >
      <div className="w-full max-w-md text-center">
        <p className="text-sm font-medium text-destructive">Algo ha fallado</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">
          No hemos podido cargar esta sección
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Vuelve a intentarlo. Si el problema continúa, inicia sesión de nuevo.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button type="button" onClick={reset} className="h-11 px-5">
            Reintentar
          </Button>
        </div>
      </div>
    </main>
  );
}
