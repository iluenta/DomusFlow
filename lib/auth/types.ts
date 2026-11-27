export type AuthFormStatus = "idle" | "error" | "success";

export type AuthFormState = {
  status: AuthFormStatus;
  message?: string;
  fieldErrors?: Record<string, string>;
  completedAt?: number;
};

export const initialAuthFormState: AuthFormState = {
  status: "idle",
};
