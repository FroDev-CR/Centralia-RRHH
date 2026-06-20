"use client";
export default function DashboardError({ error, reset }) {
  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, background: "rgb(6 8 11)", color: "rgb(242 246 248)", fontFamily: "Poppins,system-ui,sans-serif" }}>
      <div style={{ maxWidth: 540, background: "rgb(16 22 26)", border: "1px solid rgb(33 44 48)", borderRadius: 16, padding: 28 }}>
        <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>Algo salió mal en el panel</div>
        <p style={{ color: "rgb(151 168 172)", fontSize: 14, margin: "0 0 16px" }}>{String(error?.message || "Error desconocido")}</p>
        <button onClick={() => reset()} style={{ color: "#fff", border: "none", borderRadius: 10, padding: "10px 18px", fontFamily: "inherit", fontWeight: 600, cursor: "pointer", backgroundImage: "linear-gradient(120deg,#0d9488,#10b981,#4f46e5)" }}>Reintentar</button>
      </div>
    </div>
  );
}
