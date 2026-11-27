export function FieldError({
  id,
  message,
}: {
  id: string;
  message?: string;
}) {
  if (!message) return null;

  return (
    <p id={id} className="text-xs leading-5 text-destructive">
      {message}
    </p>
  );
}
