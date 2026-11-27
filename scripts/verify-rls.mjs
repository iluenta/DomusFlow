import nextEnv from "@next/env";
import { createClient } from "@supabase/supabase-js";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publicKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const secretKey =
  process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !publicKey || !secretKey) {
  console.log(
    "SKIP: faltan NEXT_PUBLIC_SUPABASE_URL, la clave pública o SUPABASE_SECRET_KEY.",
  );
  process.exit(0);
}

const stamp = Date.now();
const password = `RlsTest-${stamp}-Aaa!`;
const userA = {
  email: `rls.a.${stamp}@example.com`,
  password,
  full_name: "RLS Usuario A",
};
const userB = {
  email: `rls.b.${stamp}@example.com`,
  password,
  full_name: "RLS Usuario B",
};

const admin = createClient(url, secretKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

let failures = 0;
function check(name, condition, detail = "") {
  if (condition) {
    console.log(`✓ ${name}`);
  } else {
    failures += 1;
    console.error(`✗ ${name}${detail ? `: ${detail}` : ""}`);
  }
}

async function createUser(input) {
  const { data, error } = await admin.auth.admin.createUser({
    email: input.email,
    password: input.password,
    email_confirm: true,
    user_metadata: { full_name: input.full_name },
  });

  if (error || !data.user) {
    throw new Error(`No se pudo crear ${input.email}: ${error?.message}`);
  }

  return data.user;
}

async function signIn(email, pass) {
  const client = createClient(url, publicKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data, error } = await client.auth.signInWithPassword({
    email,
    password: pass,
  });
  if (error || !data.session) {
    throw new Error(`No se pudo iniciar sesión como ${email}: ${error?.message}`);
  }
  return client;
}

let a;
let b;

try {
  a = await createUser(userA);
  b = await createUser(userB);

  // Anon cannot read profiles.
  const anon = createClient(url, publicKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const anonRead = await anon.from("profiles").select("id").limit(1);
  check(
    "anon no puede leer profiles",
    Boolean(anonRead.error) || (anonRead.data ?? []).length === 0,
    anonRead.error?.message,
  );

  // A can only see itself.
  const clientA = await signIn(userA.email, userA.password);
  const own = await clientA
    .from("profiles")
    .select("id, full_name")
    .eq("id", a.id)
    .maybeSingle();
  check(
    "A puede leer su propio perfil",
    Boolean(own.data) && !own.error,
    own.error?.message,
  );
  check(
    "A solo ve una fila en profiles",
    (await clientA.from("profiles").select("id")).data?.length === 1,
  );

  const otherRead = await clientA
    .from("profiles")
    .select("id")
    .eq("id", b.id)
    .maybeSingle();
  check(
    "A no puede leer el perfil de B",
    !otherRead.data,
    otherRead.error?.message,
  );

  const otherUpdate = await clientA
    .from("profiles")
    .update({ full_name: "Intento no permitido" })
    .eq("id", b.id)
    .select("id");
  check(
    "A no puede actualizar el perfil de B",
    !otherUpdate.error && (otherUpdate.data ?? []).length === 0,
    otherUpdate.error?.message,
  );

  const adminOther = await admin
    .from("profiles")
    .select("full_name")
    .eq("id", b.id)
    .maybeSingle();
  check(
    "El perfil de B no fue modificado",
    adminOther.data?.full_name === userB.full_name,
    adminOther.data?.full_name,
  );
} catch (error) {
  failures += 1;
  console.error("✗ Error inesperado:", error.message);
} finally {
  for (const user of [a, b]) {
    if (user) await admin.auth.admin.deleteUser(user.id).catch(() => {});
  }
}

if (failures > 0) {
  console.error(`\n${failures} comprobación(es) de RLS fallaron.`);
  process.exitCode = 1;
}

console.log("\nRLS verificado correctamente.");
