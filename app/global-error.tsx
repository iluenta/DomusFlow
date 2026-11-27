"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="es">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "grid",
          placeItems: "center",
          background: "#f7f8f9",
          color: "#101418",
          fontFamily:
            'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
          padding: "24px",
        }}
      >
        <main style={{ maxWidth: "28rem", textAlign: "center" }}>
          <p style={{ color: "#14584c", fontSize: "0.875rem", fontWeight: 600 }}>
            Hospyia
          </p>
          <h1 style={{ fontSize: "1.5rem", marginTop: "0.5rem" }}>
            No hemos podido cargar la aplicación
          </h1>
          <p style={{ color: "#5a6572", fontSize: "0.875rem", lineHeight: 1.6 }}>
            Recarga la página para volver a intentarlo.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: "2rem",
              minHeight: "2.75rem",
              borderRadius: "0.5rem",
              border: 0,
              background: "#14584c",
              color: "#ffffff",
              padding: "0 1.25rem",
              fontSize: "0.875rem",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Reintentar
          </button>
        </main>
      </body>
    </html>
  );
}
