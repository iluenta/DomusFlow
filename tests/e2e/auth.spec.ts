import { expect, test } from "@playwright/test";

const email = process.env.E2E_EMAIL;
const password = process.env.E2E_PASSWORD;
const hasCredentials = Boolean(email && password);

test.describe("autenticación", () => {
  test.skip(
    !hasCredentials,
    "Faltan E2E_EMAIL y E2E_PASSWORD (ejecuta npm run seed).",
  );

  test("credenciales inválidas muestran un error genérico", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill("nadie@example.com");
    await page.getByLabel("Contraseña", { exact: true }).fill("incorrecta");
    await page.getByRole("button", { name: "Entrar" }).click();

    await expect(
      page.getByText("Email o contraseña incorrectos."),
    ).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });

  test("el tema se alterna y persiste al recargar", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill(email ?? "");
    await page.getByLabel("Contraseña", { exact: true }).fill(password ?? "");
    await page.getByRole("button", { name: "Entrar" }).click();
    await expect(page).toHaveURL(/\/dashboard/);

    const html = page.locator("html");
    await expect(html).not.toHaveClass(/dark/);

    await page.getByRole("button", { name: "Cambiar tema" }).click();
    await expect(html).toHaveClass(/dark/);

    await page.reload();
    await expect(html).toHaveClass(/dark/);
    await page.getByRole("button", { name: "Cambiar tema" }).click();
    await expect(html).not.toHaveClass(/dark/);
  });

  test("login, dashboard y logout", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill(email ?? "");
    await page.getByLabel("Contraseña", { exact: true }).fill(password ?? "");
    await page.getByRole("button", { name: "Entrar" }).click();

    await expect(page).toHaveURL(/\/dashboard/);
    await expect(
      page.getByRole("heading", { name: /Hola,/ }),
    ).toBeVisible();
    await expect(page.getByText(email ?? "")).toBeVisible();

    await page
      .getByRole("button", { name: /Abrir menú de cuenta/ })
      .click();
    await page.getByRole("menuitem", { name: "Cerrar sesión" }).click();

    await expect(page).toHaveURL(/\/login\?estado=sesion-cerrada/);
    await expect(
      page.getByText("Has cerrado sesión correctamente."),
    ).toBeVisible();

    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login\?next=%2Fdashboard/);
  });
});
