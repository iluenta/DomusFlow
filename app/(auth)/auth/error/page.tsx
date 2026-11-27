import type { Metadata } from "next";
import Link from "next/link";
import { CircleAlert } from "lucide-react";

import { authErrorCopy } from "@/lib/auth/messages";
import { first, type SearchParams } from "@/lib/search-params";

export const metadata: Metadata = {
  title: "Enlace no válido",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const copy = authErrorCopy(first(params.motivo));

  return (
    <div className="space-y-6">
      <div className="flex size-11 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <CircleAlert aria-hidden="true" className="size-5" />
      </div>

      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">{copy.title}</h1>
        <p className="text-sm leading-6 text-muted-foreground">
          {copy.description}
        </p>
      </header>

      <div className="flex flex-col gap-3">
        <Link
          href="/recuperar-contrasena"
          className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          Solicitar un enlace nuevo
        </Link>
        <Link
          href="/login"
          className="inline-flex h-11 items-center justify-center rounded-lg border border-border px-4 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          Volver al acceso
        </Link>
      </div>
    </div>
  );
}
