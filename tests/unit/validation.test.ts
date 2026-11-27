import { describe, expect, it } from "vitest";

import {
  emailOnlySchema,
  fieldErrorsFromZod,
  loginSchema,
  registerSchema,
  updatePasswordSchema,
} from "@/lib/auth/validation";

describe("auth validation", () => {
  it("normalizes email casing and whitespace", () => {
    const result = emailOnlySchema.safeParse({ email: "  USER@Example.COM " });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("user@example.com");
    }
  });

  it("rejects malformed emails", () => {
    expect(emailOnlySchema.safeParse({ email: "no-es-email" }).success).toBe(
      false,
    );
  });

  it("requires a 12-character password on registration", () => {
    const result = registerSchema.safeParse({
      full_name: "Ana",
      email: "ana@example.com",
      password: "short",
      confirm_password: "short",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(fieldErrorsFromZod(result.error).password).toContain("12");
    }
  });

  it("rejects mismatched passwords", () => {
    const result = registerSchema.safeParse({
      full_name: "Ana",
      email: "ana@example.com",
      password: "Una contraseña larga",
      confirm_password: "Otra contraseña larga",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(fieldErrorsFromZod(result.error).confirm_password).toBe(
        "Las contraseñas no coinciden.",
      );
    }
  });

  it("allows logging in with a short existing password", () => {
    const result = loginSchema.safeParse({
      email: "ana@example.com",
      password: "short",
      next: "/dashboard",
    });
    expect(result.success).toBe(true);
  });

  it("checks the new password confirmation", () => {
    const result = updatePasswordSchema.safeParse({
      password: "Una contraseña larga",
      confirm_password: "Una contraseña distinta",
    });
    expect(result.success).toBe(false);
  });
});
