import { z } from "zod";

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, "Introduce tu email.")
  .max(254, "El email es demasiado largo.")
  .email("Introduce un email válido.");

const passwordSchema = z
  .string()
  .min(12, "La contraseña debe tener al menos 12 caracteres.")
  .max(72, "La contraseña no puede superar los 72 caracteres.");

export const loginSchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .min(1, "Introduce tu contraseña.")
    .max(72, "La contraseña no puede superar los 72 caracteres."),
  next: z.string().optional(),
});

export const registerSchema = z
  .object({
    full_name: z
      .string()
      .trim()
      .min(2, "Escribe tu nombre.")
      .max(80, "El nombre no puede superar los 80 caracteres."),
    email: emailSchema,
    password: passwordSchema,
    confirm_password: z.string().min(1, "Repite la contraseña."),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Las contraseñas no coinciden.",
    path: ["confirm_password"],
  });

export const emailOnlySchema = z.object({
  email: emailSchema,
});

export const updatePasswordSchema = z
  .object({
    password: passwordSchema,
    confirm_password: z.string().min(1, "Repite la contraseña."),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Las contraseñas no coinciden.",
    path: ["confirm_password"],
  });

export const resendVerificationSchema = z.object({
  email: emailSchema,
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type EmailOnlyInput = z.infer<typeof emailOnlySchema>;
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;

export function fieldErrorsFromZod(
  error: z.ZodError,
): Record<string, string> {
  const errors: Record<string, string> = {};

  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "");
    if (key && !errors[key]) {
      errors[key] = issue.message;
    }
  }

  return errors;
}
