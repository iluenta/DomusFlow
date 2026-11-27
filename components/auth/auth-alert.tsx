import { CircleAlert, CircleCheck } from "lucide-react";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { cn } from "cn";

export function AuthAlert({
  variant = "default",
  title,
  children,
  className,
}: {
  variant?: "default" | "destructive";
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const isError = variant === "destructive";

  return (
    <Alert
      variant={variant}
      role={isError ? "alert" : "status"}
      aria-live={isError ? "assertive" : "polite"}
      className={cn("mb-5", className)}
    >
      {isError ? (
        <CircleAlert aria-hidden="true" />
      ) : (
        <CircleCheck aria-hidden="true" className="text-success" />
      )}
      {title ? <AlertTitle>{title}</AlertTitle> : null}
      <AlertDescription className={cn(!isError && "text-muted-foreground")}>
        {children}
      </AlertDescription>
    </Alert>
  );
}
