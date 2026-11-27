# Arquitectura de Hospyia (hito 1)

## Contexto

Hospyia es una aplicación web para anfitriones. Este hito construye únicamente la base de acceso y el panel principal. El dominio `hospyia.com` ya servía una landing independiente; según la decisión del proyecto, esa landing se retirará del dominio cuando se valide esta aplicación. Mientras tanto, el trabajo se hace en un proyecto Vercel nuevo y en local.

- Repositorio: `DomusFlow` (nombre histórico).
- Marca: **Hospyia**.
- Dominio de producción: `https://hospyia.com`.
- La raíz `/` devuelve **404**.
- Acceso: `/login`; panel: `/dashboard`.

## Diagrama

```mermaid
flowchart LR
  U[Usuario / PWA] -->|HTTPS + cookies| N[Next.js 16 en Vercel]
  N -->|Server Components| SC[Renderizado y lectura de datos]
  N -->|Server Actions| SA[Login, registro, logout, recuperación]
  N -->|Route Handler| RC[/auth/confirm]
  N -->|proxy.ts| P[Refresco de sesión y guard de rutas]
  N -->|clave publicable + JWT| SB[(Supabase Auth + Postgres + RLS)]
  P -->|getClaims| SB
```

## Por qué Next.js full-stack

- Un solo despliegue y un solo lenguaje para frontend y backend.
- Las Server Actions mantienen la clave secreta y la lógica sensible en servidor.
- Supabase aporta autenticación y Postgres con RLS; no hace falta un ORM ni un servicio Nest/Fastify para este alcance.
- Si en el futuro aparecen jobs pesados, integraciones o colas, se pueden añadir Edge Functions o un worker sin rehacer el frontend.

## Estructura

```
app/
  (auth)/        # login, registro, verificación, recuperación, error
  (app)/         # layout protegido y dashboard
  auth/confirm/  # canje de token_hash o code
  actions/       # server actions de autenticación
  api/           # (futuro)
  page.tsx       # 404 de la raíz
components/
  auth/          # formularios y controles accesibles
  brand/         # logo y marca
  layout/        # shell, tema y menú de usuario
  pwa/           # registro del service worker
  ui/            # shadcn/ui
lib/
  auth/          # validación, errores, redirects, mensajes, usuario
  data/          # consultas de perfil
  supabase/      # clientes navegador/servidor/proxy
  env.ts         # variables y URL canónica
proxy.ts         # entrada de Next 16
supabase/        # migración SQL
scripts/         # seed, RLS e iconos
tests/           # unitarios y E2E
```

## Flujos

### Registro y verificación

1. El formulario envía nombre, email y contraseña a `registerAction`.
2. Zod valida en servidor; `supabase.auth.signUp` guarda `full_name` en metadata y usa `emailRedirectTo=${SITE_URL}/auth/confirm`.
3. Si la confirmación está desactivada, Supabase devuelve sesión y se entra al panel. Si está activa, se muestra `/verificar-email`.
4. El correo apunta a `/auth/confirm?token_hash=…&type=signup&next=/dashboard`.
5. El Route Handler ejecuta `verifyOtp` (o `exchangeCodeForSession` si llega `code`), crea las cookies y redirige al destino validado.
6. El trigger de Postgres crea la fila de `profiles`.

### Login y sesión

1. `loginAction` valida y llama a `signInWithPassword`.
2. `@supabase/ssr` escribe las cookies de sesión mediante `setAll`.
3. El proxy refresca la sesión en cada request con `getClaims`.
4. El layout protegido y el dashboard llaman a `getUser` en servidor; no confían solo en el proxy.
5. `requireUser` redirige a `/login?next=…` si no hay sesión.

### Recuperación

1. `resetPasswordForEmail` envía un enlace `type=recovery`.
2. `/auth/confirm` crea una sesión temporal y redirige a `/restablecer-contrasena`.
3. `updatePasswordAction` actualiza la contraseña, cierra todas las sesiones y vuelve al login.

### Logout

Es una Server Action invocada desde un formulario/menú, no un enlace GET. Evita cierres accidentales por prefetch y permite invalidar la sesión en servidor.

## Seguridad

### Claves

| Variable | Exposición | Uso |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Pública | Endpoint |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Pública | Cliente con RLS |
| `SUPABASE_SECRET_KEY` | Solo servidor/scripts | Seed y verificación RLS |
| `NEXT_PUBLIC_SITE_URL` | Pública | Enlaces de email y canonical |

La clave secreta no se usa en runtime de la aplicación. Los scripts que la usan crean y eliminan usuarios temporales.

### RLS

`profiles` tiene RLS activo:

- `select`: el usuario autenticado solo ve su fila.
- `update`: solo puede actualizar `full_name` de su fila.
- `anon`: sin privilegios.
- Inserción: solo el trigger `security definer` al crear el usuario.
- Borrado: cascada desde `auth.users`; no hay política de delete para clientes.

La app consulta explícitamente `eq("id", user.id)` para dejar clara la intención, pero RLS es la última barrera.

### Rutas

- El proxy solo protege prefijos explícitos: `/dashboard` y los futuros módulos del shell.
- Las rutas desconocidas y la raíz no redirigen a login: devuelven 404. Esto permite que la futura landing pública `/[nombre_propiedad]` sea pública sin tocar la autenticación.
- `next` se valida contra URLs absolutas, `//` y backslashes.
- Las páginas privadas tienen `robots: noindex`; `robots.ts` bloquea las rutas de auth y dashboard, pero deja indexables las futuras landings públicas.

### Cookies y cabeceras

- Cookies gestionadas por `@supabase/ssr`, `SameSite=Lax` y `Secure` en producción.
- No se guarda la sesión en `localStorage`.
- `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy` y `Permissions-Policy` en todas las respuestas; HSTS en producción.
- `Cache-Control: private, no-store` en dashboard y páginas de auth.
- Una CSP estricta queda para la fase de endurecimiento; requiere nonce para los scripts de hidratación de Next.

### Errores

- Login: “Email o contraseña incorrectos”.
- Registro y recuperación: mensaje genérico, sin confirmar si el email existe.
- El detalle técnico de Supabase se registra como código, nunca se muestra al usuario.

## PWA

- Manifest en `app/manifest.ts`, iconos generados con `npm run icons`.
- `start_url: /dashboard`, `scope: /`, `display: standalone`.
- Service worker mínimo: precarga `offline.html` e iconos, cachea solo `/_next/static` y assets estáticos, y usa red primero para navegación.
- Nunca cachea HTML autenticado, RSC, Supabase, `/api` ni Server Actions.
- Sin `skipWaiting` automático; la versión nueva se activa en la siguiente visita.
- Se registra solo en producción; en desarrollo se desregistra para evitar cachés obsoletas.

## Decisiones deliberadas

- **Sin backend separado:** Next.js cubre el alcance actual. Un servicio aparte añadiría despliegue, CORS y mantenimiento sin beneficio.
- **Sin ORM:** las consultas son mínimas y RLS/SQL se revisan directamente. Se puede añadir tipos generados de Supabase más adelante.
- **Cache Components desactivado:** el panel depende de la sesión y no debe compartir shell cacheado. Se prioriza el modelo dinámico clásico; se puede adoptar más adelante si se necesita streaming avanzado.
- **Sin página de cuenta ni bottom nav:** solo hay un destino en este hito. El menú de usuario cubre identidad y logout; en móvil la navegación se resuelve con un panel lateral (`Sheet`) y la navegación inferior se añadirá cuando existan varios módulos.
- **Proveedor de tema propio en lugar de `next-themes`:** la versión actual de `next-themes` renderiza un `<script>` dentro del árbol React, lo que React 19 marca como error en desarrollo. El script de inicialización se inyecta con `useServerInsertedHTML` y el contexto aplica el tema sin flash y sin ese aviso.
- **Service worker propio:** evita un plugin de build con Turbopack y mantiene una política de caché pequeña y auditable.
- **Enlaces token_hash:** permiten confirmar/restablecer desde otro navegador. Se documenta la limitación de almacenamiento aislado en la PWA de iOS.

## Futuro: landing `/[nombre_propiedad]`

- Se implementará en `app/(public)/[nombre_propiedad]/page.tsx` con su propio layout público, metadatos/canonical y lectura de datos con RLS.
- Las rutas estáticas tienen prioridad sobre el segmento dinámico.
- Slugs reservados: `login`, `registro`, `dashboard`, `auth`, `api`, `icons`, `brand`, `offline.html`, `sw.js`, `manifest.webmanifest`, `robots.txt`, `sitemap.xml`, `favicon.ico`.
- El proxy no debe redirigir esas rutas a login.
- Si la landing necesita datos públicos, se añadirán políticas RLS de solo lectura para el rol `anon` sobre las tablas publicadas.

## Cutover del dominio

1. Validar el preview de Vercel con auth real, PWA y 404 de la raíz.
2. Añadir `hospyia.com` y `www` al proyecto nuevo; completar DNS.
3. Actualizar Supabase Site URL / Redirect URLs.
4. Verificar HTTPS, cookies `Secure`, `/` 404, `/login`, `/dashboard`, emails y PWA.
5. Mantener el proyecto Vercel antiguo para rollback; no borrarlo durante la validación.
