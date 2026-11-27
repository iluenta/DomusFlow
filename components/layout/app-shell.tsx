import { Sparkles } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { MobileNav } from "@/components/layout/mobile-nav";
import { NavLinks } from "@/components/layout/nav-links";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { UserMenu } from "@/components/layout/user-menu";

export function AppShell({
  name,
  email,
  children,
}: {
  name: string;
  email: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-background">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] text-sidebar-foreground lg:flex">
        <div className="flex h-16 items-center border-b border-sidebar-border px-5">
          <Logo href="/dashboard" />
        </div>

        <nav
          aria-label="Navegación principal"
          className="flex flex-1 flex-col gap-1 px-3 py-4"
        >
          <NavLinks />

          <div className="mt-6 flex items-center gap-2 px-3 text-xs font-medium text-muted-foreground">
            <Sparkles aria-hidden="true" className="size-3.5" />
            Próximamente
          </div>
          <p className="px-3 pt-1 text-xs leading-5 text-muted-foreground">
            Los módulos de tu espacio se activarán en la siguiente fase.
          </p>
        </nav>

        <div className="border-t border-sidebar-border px-5 py-4">
          <p className="text-xs text-muted-foreground">Hospyia · Beta</p>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-[calc(4rem+env(safe-area-inset-top))] items-center justify-between gap-2 border-b border-border bg-background/85 px-3 pt-[env(safe-area-inset-top)] backdrop-blur sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-1.5">
            <MobileNav />
            <span className="lg:hidden">
              <Logo href="/dashboard" />
            </span>
            <div className="hidden min-w-0 lg:block">
              <p className="truncate text-sm font-medium">Panel</p>
              <p className="truncate text-xs text-muted-foreground">
                Tu espacio de trabajo
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <ThemeToggle />
            <UserMenu name={name} email={email} />
          </div>
        </header>

        <main
          id="contenido"
          tabIndex={-1}
          className="mx-auto w-full max-w-7xl scroll-mt-[calc(4rem+env(safe-area-inset-top))] px-4 py-6 pb-[calc(env(safe-area-inset-bottom)+1.5rem)] sm:px-6 lg:px-8 lg:py-8"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
