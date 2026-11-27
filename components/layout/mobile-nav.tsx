"use client";

import { useState } from "react";
import { Menu, Sparkles, X } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { NavLinks } from "@/components/layout/nav-links";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className="inline-flex size-11 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring lg:hidden"
        aria-label="Abrir menú de navegación"
      >
        <Menu aria-hidden="true" className="size-5" />
      </SheetTrigger>

      <SheetContent
        side="left"
        className="w-[min(20rem,88vw)] gap-0 p-0"
        showCloseButton={false}
      >
        <SheetHeader className="border-b border-sidebar-border p-5">
          <div className="flex items-center justify-between gap-4">
            <Logo />
            <SheetClose
              className="inline-flex size-11 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              aria-label="Cerrar menú de navegación"
            >
              <X aria-hidden="true" className="size-5" />
            </SheetClose>
          </div>
          <SheetTitle className="sr-only">Navegación</SheetTitle>
        </SheetHeader>

        <nav
          aria-label="Navegación principal"
          className="flex flex-1 flex-col gap-1 p-3"
        >
          <NavLinks onNavigate={() => setOpen(false)} />

          <div className="mt-5 flex items-center gap-2 px-3 text-xs font-medium text-muted-foreground">
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
      </SheetContent>
    </Sheet>
  );
}
