import { describe, expect, it } from "vitest";

import { safeNextPath } from "@/lib/auth/redirects";

describe("safeNextPath", () => {
  it("accepts a local path", () => {
    expect(safeNextPath("/dashboard")).toBe("/dashboard");
    expect(safeNextPath("/dashboard?tab=1")).toBe("/dashboard?tab=1");
  });

  it("rejects external or protocol-relative URLs", () => {
    expect(safeNextPath("https://evil.example")).toBe("/dashboard");
    expect(safeNextPath("//evil.example/path")).toBe("/dashboard");
    expect(safeNextPath("/\\evil")).toBe("/dashboard");
    expect(safeNextPath("javascript:alert(1)")).toBe("/dashboard");
  });

  it("falls back when the value is empty or missing", () => {
    expect(safeNextPath(undefined)).toBe("/dashboard");
    expect(safeNextPath("")).toBe("/dashboard");
    expect(safeNextPath("/login", "/fallback")).toBe("/login");
  });
});
