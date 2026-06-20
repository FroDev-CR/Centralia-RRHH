"use client";
export default function GlobalError({ error, reset }) {
  return (
    <html lang="es"><body style={{ margin: 0, minHeight: "100vh", display: "grid", placeItems: "center", background: "#06080b", color: "#f2f6f8", fontFamily: "system-ui,sans-serif" }}>
      <div style={{ maxWidth: 520, padding: 28, textAlign: "center" }}>
        <h2 style={{ margin: "0 0 8px" }}>Ocurrió un error</h2>
        <p style={{ color: "#97a8ac", fontSize: 14 }}>{String(error?.message || "Error desconocido")}</p>
        <button onClick={() => reset()} style={{ marginTop: 14, color: "#fff", border: "none", borderRadius: 10, padding: "10px 18px", fontWeight: 600, cursor: "pointer", backgroundImage: "linear-gradient(120deg,#0d9488,#10b981,#4f46e5)" }}>Reintentar</button>
      </div>
    </body></html>
  );
}
