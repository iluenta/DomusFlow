import { Logo } from "@/components/brand/logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main
      id="contenido"
      tabIndex={-1}
      className="relative isolate flex min-h-dvh flex-col items-center justify-center overflow-hidden px-4 pt-[calc(2.5rem+env(safe-area-inset-top))] pb-[calc(2.5rem+env(safe-area-inset-bottom))] sm:px-6"
    >
      <div
        aria-hidden="true"
        className="background-grid pointer-events-none absolute inset-0 -z-10 opacity-60"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,color-mix(in_oklab,var(--primary)_10%,transparent),transparent_55%)]"
      />

      <div className="relative w-full max-w-md">
        <div className="mb-7 flex justify-center">
          <Logo />
        </div>

        <div className="rounded-xl bg-card p-6 shadow-sm ring-1 ring-foreground/10 sm:p-8">
          {children}
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Hospyia · Acceso seguro
        </p>
      </div>
    </main>
  );
}
