import { AppShell } from "@/components/layout/app-shell";
import { displayName, getProfile } from "@/lib/data/profiles";
import { requireUser } from "@/lib/auth/user";

export const dynamic = "force-dynamic";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();
  const profile = await getProfile(user.id);
  const name = displayName(
    profile,
    user.email,
    user.user_metadata?.full_name,
  );

  return (
    <AppShell name={name} email={user.email ?? "Sin email"}>
      {children}
    </AppShell>
  );
}
