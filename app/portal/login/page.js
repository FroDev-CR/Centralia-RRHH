"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function PortalLogin() {
  const router = useRouter();
  const [f, setF] = useState({ codigo: "", username: "", password: "" });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const up = (k, v) => setF((s) => ({ ...s, [k]: v }));
  async function submit(e) {
    e.preventDefault(); setErr(""); setBusy(true);
    try {
      const r = await fetch("/api/employee/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) });
      const d = await r.json();
      if (!r.ok) { setErr(d.error || "No se pudo iniciar sesión"); setBusy(false); return; }
      router.push("/portal"); router.refresh();
    } catch { setErr("Error de conexión"); setBusy(false); }
  }
  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, background: "rgb(var(--bg))" }}>
      <form onSubmit={submit} style={{ width: 380, maxWidth: "94vw", background: "rgb(var(--card))", border: "1px solid rgb(var(--border))", borderRadius: 18, padding: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 20 }}>
          <span className="logo-sq brand-grad" style={{ fontSize: 17 }}>👥</span>
          <div style={{ lineHeight: 1.1 }}><div style={{ fontWeight: 800, fontSize: 15 }}>Centralia · Personas</div><div style={{ fontSize: 12, color: "rgb(var(--muted-fg))" }}>Portal del empleado</div></div>
        </div>
        <div className="field" style={{ marginBottom: 12 }}><label>Código de empresa</label><input value={f.codigo} onChange={(e) => up("codigo", e.target.value.toUpperCase())} placeholder="Ej: ABC123" autoCapitalize="characters" /></div>
        <div className="field" style={{ marginBottom: 12 }}><label>Usuario</label><input value={f.username} onChange={(e) => up("username", e.target.value)} placeholder="tu usuario" /></div>
        <div className="field" style={{ marginBottom: 16 }}><label>Contraseña</label><input type="password" value={f.password} onChange={(e) => up("password", e.target.value)} placeholder="••••••••" /></div>
        {err && <div style={{ color: "rgb(var(--destructive))", fontSize: 13, marginBottom: 12 }}>{err}</div>}
        <button type="submit" disabled={busy} className="brand-grad" style={{ width: "100%", color: "#fff", border: "none", borderRadius: 11, padding: 12, fontFamily: "inherit", fontWeight: 600, fontSize: 14.5, cursor: "pointer", opacity: busy ? .7 : 1 }}>{busy ? "Ingresando…" : "Ingresar"}</button>
        <div style={{ textAlign: "center", marginTop: 16, fontSize: 13 }}><Link href="/" style={{ color: "rgb(var(--muted-fg))" }}>← Volver al inicio</Link></div>
        <p style={{ fontSize: 11.5, color: "rgb(var(--muted-fg))", marginTop: 14, textAlign: "center" }}>El código de empresa te lo da tu patrón. ¿Sos el patrón? <Link href="/sign-in" style={{ color: "rgb(var(--primary))" }}>Entrá acá</Link>.</p>
      </form>
    </div>
  );
}
