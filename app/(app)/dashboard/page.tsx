import type { Metadata } from "next";
import {
  Activity,
  BookOpen,
  Building2,
  CheckCircle2,
  Clock3,
  ListChecks,
  Sparkles,
} from "lucide-react";

import { AuthAlert } from "@/components/auth/auth-alert";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { displayName, getProfile } from "@/lib/data/profiles";
import { requireUser } from "@/lib/auth/user";
import { first, type SearchParams } from "@/lib/search-params";

export const metadata: Metadata = {
  title: "Panel",
  robots: {
    index: false,
    follow: false,
  },
};

const placeholders = [
  {
    label: "Propiedades",
    description: "Tus alojamientos aparecerán aquí.",
    icon: Building2,
  },
  {
    label: "Guías",
    description: "Las guías de tus huéspedes, en un solo lugar.",
    icon: BookOpen,
  },
  {
    label: "Actividad",
    description: "Lo que ocurra en tu cuenta, cuando ocurra.",
    icon: Activity,
  },
] as const;

function memberSince(value: string | undefined): string | null {
  if (!value) return null;

  try {
    return new Intl.DateTimeFormat("es-ES", {
      dateStyle: "long",
      timeZone: "Europe/Madrid",
    }).format(new Date(value));
  } catch {
    return null;
  }
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const user = await requireUser();
  const profile = await getProfile(user.id);
  const params = await searchParams;
  const name = displayName(profile, user.email, user.user_metadata?.full_name);
  const firstName = name.split(/\s+/)[0] ?? name;
  const emailVerified = Boolean(user.email_confirmed_at);
  const since = memberSince(profile?.created_at);

  return (
    <div className="space-y-6">
      {first(params.estado) === "bienvenida" ? (
        <AuthAlert title="Cuenta verificada">
          Ya puedes empezar a usar tu panel. Los módulos llegarán en la
          siguiente fase.
        </AuthAlert>
      ) : null}

      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Hola, {firstName}
          </h1>
          <p className="text-sm text-muted-foreground">
            Este es tu espacio de trabajo en Hospyia.
          </p>
        </div>

        <Badge
          variant={emailVerified ? "secondary" : "outline"}
          className="h-7 w-fit gap-1.5 px-2.5 text-xs"
        >
          {emailVerified ? (
            <CheckCircle2 aria-hidden="true" className="text-success" />
          ) : (
            <Clock3 aria-hidden="true" />
          )}
          {emailVerified ? "Email verificado" : "Verificación pendiente"}
        </Badge>
      </header>

      <section aria-label="Resumen de la cuenta" className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle as="h2">Tu cuenta</CardTitle>
            <CardDescription>
              Los datos de tu sesión, leídos de forma segura desde tu perfil.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs text-muted-foreground">Nombre</p>
              <p className="mt-1 truncate text-sm font-medium">{name}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="mt-1 truncate text-sm font-medium">
                {user.email ?? "Sin email"}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Estado</p>
              <p className="mt-1 text-sm font-medium">
                {emailVerified ? "Cuenta verificada" : "Pendiente de verificar"}
              </p>
            </div>
            {since ? (
              <div>
                <p className="text-xs text-muted-foreground">Miembro desde</p>
                <p className="mt-1 text-sm font-medium">{since}</p>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle as="h2">Primeros pasos</CardTitle>
            <CardDescription>Tu cuenta en Hospyia.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2.5 text-sm">
              <CheckCircle2 aria-hidden="true" className="size-4 text-success" />
              Cuenta creada
            </div>
            <div className="flex items-center gap-2.5 text-sm">
              {emailVerified ? (
                <CheckCircle2
                  aria-hidden="true"
                  className="size-4 text-success"
                />
              ) : (
                <Clock3 aria-hidden="true" className="size-4 text-warning" />
              )}
              {emailVerified ? "Email verificado" : "Verifica tu email"}
            </div>
            <div className="flex items-center gap-2.5 text-sm">
              {profile?.full_name ? (
                <CheckCircle2
                  aria-hidden="true"
                  className="size-4 text-success"
                />
              ) : (
                <Clock3 aria-hidden="true" className="size-4 text-warning" />
              )}
              Perfil con nombre
            </div>
          </CardContent>
        </Card>
      </section>

      <section aria-label="Módulos" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {placeholders.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.label} data-placeholder="true">
              <CardHeader>
                <span className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <Icon aria-hidden="true" className="size-4" />
                </span>
                <CardTitle as="h2" className="mt-2">
                  {item.label}
                </CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Aún sin datos</p>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <Card className="border-dashed">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles aria-hidden="true" className="size-4 text-primary" />
            <CardTitle as="h2">Próximamente</CardTitle>
          </div>
          <CardDescription>
            Estamos preparando la gestión de propiedades, guías y actividad.
          </CardDescription>
        </CardHeader>
        <CardFooter className="gap-2 text-xs text-muted-foreground">
          <ListChecks aria-hidden="true" className="size-4" />
          Los módulos de tu espacio se activarán en la siguiente fase.
        </CardFooter>
      </Card>
    </div>
  );
}
