import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const email = process.env.E2E_EMAIL;
const password = process.env.E2E_PASSWORD;
const hasCredentials = Boolean(email && password);

type Violation = {
  impact?: string | null;
  id: string;
};

function seriousViolations(violations: Violation[]): Violation[] {
  return violations.filter(
    (violation) =>
      violation.impact === "serious" || violation.impact === "critical",
  );
}

test("login no tiene violaciones graves de accesibilidad", async ({ page }) => {
  await page.goto("/login");

  const results = await new AxeBuilder({ page }).analyze();
  expect(seriousViolations(results.violations)).toEqual([]);
});

test("dashboard no tiene violaciones graves de accesibilidad", async ({
  page,
}) => {
  test.skip(
    !hasCredentials,
    "Faltan E2E_EMAIL y E2E_PASSWORD (ejecuta npm run seed).",
  );

  await page.goto("/login");
  await page.getByLabel("Email").fill(email ?? "");
  await page.getByLabel("Contraseña", { exact: true }).fill(password ?? "");
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page).toHaveURL(/\/dashboard/);

  const results = await new AxeBuilder({ page }).analyze();
  expect(seriousViolations(results.violations)).toEqual([]);
});
