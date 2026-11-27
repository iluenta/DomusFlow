import { expect, test } from "@playwright/test";

test("la raíz devuelve 404", async ({ page }) => {
  const response = await page.goto("/");

  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole("heading", { name: "No encontramos esta página" }),
  ).toBeVisible();
});

test("una ruta desconocida devuelve 404", async ({ page }) => {
  const response = await page.goto("/dasborad");

  expect(response?.status()).toBe(404);
});

test("el acceso está disponible en /login", async ({ page }) => {
  const response = await page.goto("/login");

  expect(response?.status()).toBe(200);
  await expect(
    page.getByRole("heading", { name: "Inicia sesión" }),
  ).toBeVisible();
});

test("/dashboard sin sesión redirige al login", async ({ page }) => {
  test.skip(
    !process.env.NEXT_PUBLIC_SUPABASE_URL,
    "Configura Supabase para probar el guard de sesión.",
  );

  await page.goto("/dashboard");

  await expect(page).toHaveURL(/\/login\?next=%2Fdashboard/);
  await expect(
    page.getByRole("heading", { name: "Inicia sesión" }),
  ).toBeVisible();
});

test("el registro está disponible", async ({ page }) => {
  const response = await page.goto("/registro");

  expect(response?.status()).toBe(200);
  await expect(
    page.getByRole("heading", { name: "Crea tu cuenta" }),
  ).toBeVisible();
});
