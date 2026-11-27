import nextEnv from "@next/env";
import { createClient } from "@supabase/supabase-js";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey =
    process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
  const email = process.env.E2E_EMAIL;
  const password = process.env.E2E_PASSWORD;

  if (!url || !secretKey) {
    console.error(
      "Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SECRET_KEY. Rellena .env.local.",
    );
    process.exitCode = 1;
    return;
  }

  if (!email || !password) {
    console.error("Faltan E2E_EMAIL o E2E_PASSWORD. Rellena .env.local.");
    process.exitCode = 1;
    return;
  }

  if (password.length < 12) {
    console.error("E2E_PASSWORD debe tener al menos 12 caracteres.");
    process.exitCode = 1;
    return;
  }

  const admin = createClient(url, secretKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      full_name: "Usuario de pruebas",
    },
  });

  if (!error) {
    console.log(`✓ Usuario de pruebas creado: ${data.user.email}`);
    return;
  }

  if (error.code === "email_exists" || /already/i.test(error.message)) {
    const { data: users, error: listError } = await admin.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });

    if (listError) {
      console.error(
        "No se pudo buscar el usuario existente:",
        listError.message,
      );
      process.exitCode = 1;
      return;
    }

    const existing = users.users.find(
      (user) => user.email?.toLowerCase() === email.toLowerCase(),
    );

    if (!existing) {
      console.error("El email existe, pero no se encontró el usuario.");
      process.exitCode = 1;
      return;
    }

    const { error: updateError } = await admin.auth.admin.updateUserById(
      existing.id,
      {
        password,
        email_confirm: true,
        user_metadata: {
          full_name: "Usuario de pruebas",
        },
      },
    );

    if (updateError) {
      console.error("No se pudo actualizar el usuario:", updateError.message);
      process.exitCode = 1;
      return;
    }

    console.log(`✓ Usuario de pruebas actualizado: ${email}`);
    return;
  }

  console.error("No se pudo crear el usuario:", error.message);
  process.exitCode = 1;
}

await main();
