import { describe, expect, it } from "vitest";

import {
  authErrorMessage,
  isRateLimitError,
} from "@/lib/auth/errors";

describe("auth errors", () => {
  it("maps invalid credentials", () => {
    expect(authErrorMessage({ code: "invalid_credentials" })).toBe(
      "Email o contraseña incorrectos.",
    );
  });

  it("maps email confirmation errors", () => {
    expect(authErrorMessage({ code: "email_not_confirmed" })).toContain(
      "Confirma tu correo",
    );
  });

  it("detects rate limits by code, status or message", () => {
    expect(isRateLimitError({ code: "over_email_send_rate_limit" })).toBe(true);
    expect(isRateLimitError({ status: 429 })).toBe(true);
    expect(
      isRateLimitError({ message: "Email rate limit exceeded" }),
    ).toBe(true);
    expect(isRateLimitError({ code: "invalid_credentials" })).toBe(false);
  });

  it("maps a 429 even when the error code is unknown", () => {
    expect(authErrorMessage({ status: 429 })).toContain("Demasiadas solicitudes");
  });

  it("does not leak unknown messages", () => {
    expect(
      authErrorMessage({ code: "unknown", message: "stack trace details" }),
    ).toBe("No hemos podido completar la operación. Inténtalo de nuevo.");
  });
});
