import { expect, test } from "@playwright/test";

test("el manifest de la PWA es válido", async ({ request }) => {
  const response = await request.get("/manifest.webmanifest");
  expect(response.status()).toBe(200);

  const manifest = await response.json();
  expect(manifest.name).toBe("Hospyia");
  expect(manifest.start_url).toBe("/dashboard");
  expect(manifest.display).toBe("standalone");
  expect(manifest.icons.length).toBeGreaterThanOrEqual(3);
});

test("la página offline existe", async ({ request }) => {
  const response = await request.get("/offline.html");
  expect(response.status()).toBe(200);
  expect(await response.text()).toContain("Estás sin conexión");
});

test("el service worker se registra en producción", async ({ page }) => {
  await page.goto("/login");

  await page.waitForFunction(
    async () => {
      if (!("serviceWorker" in navigator)) return false;
      const registrations = await navigator.serviceWorker.getRegistrations();
      return registrations.some((registration) => registration.active);
    },
    undefined,
    { timeout: 15_000 },
  );
});
